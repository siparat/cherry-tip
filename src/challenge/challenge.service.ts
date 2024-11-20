import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { ChallengeRepository } from './repositories/challenge.repository';
import { ChallengeErrorMessages } from './challenge.constants';
import { ChallengeEntity } from './entities/challenge.entity';
import { ChallengeModel, StatusEnum, UserChallengeModel } from '@prisma/client';
import { IChallenge } from './challenge.interfaces';
import { excludeProperty } from 'src/helpers/object.helpers';

@Injectable()
export class ChallengeService {
	constructor(
		private challengeRepository: ChallengeRepository,
		private logger: Logger
	) {}

	async createChallenge(dto: CreateChallengeDto): Promise<ChallengeModel> {
		const existChallenge = await this.challengeRepository.findByTitle(dto.title);
		if (existChallenge) {
			throw new ConflictException(ChallengeErrorMessages.ALREADY_EXIST_WITH_THIS_NAME);
		}

		const entity = new ChallengeEntity(dto);
		const challenge = await this.challengeRepository.createChallenge(entity);
		this.logger.log(`Challenge ${dto.title} has been successfully created`);
		return challenge;
	}

	async editChallenge(id: number, dto: CreateChallengeDto): Promise<ChallengeModel> {
		const existChallenge = await this.challengeRepository.findById(id);
		if (!existChallenge) {
			throw new NotFoundException(ChallengeErrorMessages.NOT_FOUND);
		}

		const challengeWithNewName = await this.challengeRepository.findByTitle(dto.title);
		if (challengeWithNewName?.id !== id && challengeWithNewName?.title == dto.title) {
			throw new ConflictException(ChallengeErrorMessages.ALREADY_EXIST_WITH_THIS_NAME);
		}

		const entity = new ChallengeEntity({ ...existChallenge, ...dto });
		const challenge = await this.challengeRepository.editChallenge(id, entity);
		this.logger.log(`Challenge ${dto.title} has been successfully created`);
		return challenge;
	}

	async startChallenge(challengeId: number, userId: string): Promise<UserChallengeModel> {
		const existedChallenge = await this.challengeRepository.findWithUserInfo(challengeId, userId);
		if (!existedChallenge) {
			throw new NotFoundException(ChallengeErrorMessages.NOT_FOUND);
		}
		if (existedChallenge.userChallenge?.status == StatusEnum.Started) {
			throw new BadRequestException(ChallengeErrorMessages.ALREADY_STARTED);
		}
		const result = await this.challengeRepository.startChallenge(challengeId, userId);
		this.logger.log(`Challenge ${existedChallenge.title} was started by user ${userId}`);
		return result;
	}

	async cancelChallenge(challengeId: number, userId: string): Promise<UserChallengeModel> {
		const existedChallenge = await this.challengeRepository.findWithUserInfo(challengeId, userId);
		if (!existedChallenge) {
			throw new NotFoundException(ChallengeErrorMessages.NOT_FOUND);
		}
		if (!existedChallenge.userChallenge || existedChallenge.userChallenge.status == StatusEnum.Canceled) {
			throw new BadRequestException(ChallengeErrorMessages.ALREADY_CANCELED);
		}
		const result = await this.challengeRepository.cancelChallenge(existedChallenge.userChallenge.id);
		this.logger.log(`Challenge ${existedChallenge.title} was cancelled by user ${userId}`);
		return result;
	}

	async getStatus(challengeId: number, userId: string): Promise<IChallenge> {
		const challenge = await this.challengeRepository.findWithUserInfo(challengeId, userId);
		if (!challenge) {
			throw new NotFoundException(ChallengeErrorMessages.NOT_FOUND);
		}
		const entity = new ChallengeEntity(challenge).setUserStatus(challenge.userChallenge);
		if (entity.durationIsExpired() && entity.userChallenge) {
			const newUserStatus = await this.challengeRepository.finishChallenge(entity.userChallenge.id);
			entity.setUserStatus(excludeProperty(newUserStatus, 'challengeId'));
		}
		return entity.getPublicInfo();
	}
}
