import { Injectable } from '@nestjs/common';
import { ChallengeModel, StatusEnum, UserChallengeModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { ChallengeEntity } from '../entities/challenge.entity';
import { IChallenge } from '../challenge.interfaces';
import { excludeProperty } from 'src/helpers/object.helpers';
import { IPaginationParams } from 'src/common/common.interfaces';

@Injectable()
export class ChallengeRepository {
	constructor(private database: DatabaseService) {}

	createChallenge(entity: ChallengeEntity): Promise<ChallengeModel> {
		return this.database.challengeModel.create({ data: entity });
	}

	editChallenge(id: number, entity: ChallengeEntity): Promise<ChallengeModel> {
		return this.database.challengeModel.update({ where: { id }, data: entity });
	}

	deleteById(id: number): Promise<ChallengeModel> {
		return this.database.challengeModel.delete({ where: { id } });
	}

	findByTitle(title: string): Promise<ChallengeModel | null> {
		return this.database.challengeModel.findFirst({ where: { title } });
	}

	findById(id: number): Promise<ChallengeModel | null> {
		return this.database.challengeModel.findUnique({ where: { id } });
	}

	findMany(options: IPaginationParams): Promise<ChallengeModel[]> {
		return this.database.challengeModel.findMany(options);
	}

	findManyByStatus(
		status: StatusEnum | undefined,
		userId: string,
		options: IPaginationParams
	): Promise<ChallengeModel[]> {
		return this.database.challengeModel.findMany({
			where: { userChallenges: { some: { userId, status } } },
			...options
		});
	}

	async findWithUserInfo(challengeId: number, userId: string): Promise<IChallenge | null> {
		const challenge = await this.database.challengeModel.findUnique({
			where: { id: challengeId },
			include: { userChallenges: { where: { userId } } }
		});
		if (!challenge) {
			return null;
		}
		const userChallenge = challenge.userChallenges[0];
		return {
			...excludeProperty(challenge, 'userChallenges'),
			userChallenge: userChallenge && excludeProperty(userChallenge, 'challengeId')
		};
	}

	async startChallenge(challengeId: number, userId: string): Promise<UserChallengeModel> {
		const userChallenge = await this.database.userChallengeModel.findFirst({ where: { userId, challengeId } });
		if (userChallenge) {
			return this.database.userChallengeModel.update({
				where: { id: userChallenge.id },
				data: { status: StatusEnum.Started, startDate: new Date() }
			});
		}
		return this.database.userChallengeModel.create({
			data: { userId, challengeId, startDate: new Date() }
		});
	}

	cancelChallenge(userChallengeId: number): Promise<UserChallengeModel> {
		return this.database.userChallengeModel.update({
			where: { id: userChallengeId },
			data: { status: StatusEnum.Canceled }
		});
	}

	finishChallenge(userChallengeId: number): Promise<UserChallengeModel> {
		return this.database.userChallengeModel.update({
			where: { id: userChallengeId },
			data: { status: StatusEnum.Finished }
		});
	}
}
