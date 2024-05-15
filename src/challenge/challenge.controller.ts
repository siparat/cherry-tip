import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { ChallengeModel, RoleEnum, UserChallengeModel, UserModel } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/user/guards/role.guard';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { ChallengeService } from './challenge.service';
import { ChallengeErrorMessages } from './challenge.constants';
import { ChallengeRepository } from './repositories/challenge.repository';
import { User } from 'src/decorators/user.decorator';
import { IChallenge } from './challenge.interface';
import { Pagination } from 'src/decorators/pagination.decorator';
import { IPaginationParams } from 'src/common/common.interfaces';
import { LimitPaginationPipe } from 'src/pipes/limit-pagination.pipe';

@Controller('challenge')
export class ChallengeController {
	constructor(
		private challengeService: ChallengeService,
		private challengeRepository: ChallengeRepository
	) {}

	@Get('search')
	async searchChallenges(
		@Pagination(false, new LimitPaginationPipe(20)) pag: IPaginationParams
	): Promise<ChallengeModel[]> {
		return this.challengeRepository.findMany(pag);
	}

	@UseGuards(JwtAuthGuard, new RoleGuard(RoleEnum.Admin))
	@UsePipes(ValidationPipe)
	@Post('')
	async createChallenge(@Body() dto: CreateChallengeDto): Promise<ChallengeModel> {
		return this.challengeService.createChallenge(dto);
	}

	@Get(':id')
	async getById(@Param('id', ParseIntPipe) id: number): Promise<ChallengeModel> {
		const challenge = await this.challengeRepository.findById(id);
		if (!challenge) {
			throw new NotFoundException(ChallengeErrorMessages.NOT_FOUND);
		}
		return challenge;
	}

	@UseGuards(JwtAuthGuard, new RoleGuard(RoleEnum.Admin))
	@UsePipes(ValidationPipe)
	@Put(':id')
	async edit(@Body() dto: CreateChallengeDto, @Param('id', ParseIntPipe) id: number): Promise<ChallengeModel> {
		return this.challengeService.editChallenge(id, dto);
	}

	@UseGuards(JwtAuthGuard, new RoleGuard(RoleEnum.Admin))
	@Delete(':id')
	async deleteById(@Param('id', ParseIntPipe) id: number): Promise<ChallengeModel> {
		const existedChallenge = await this.challengeRepository.findById(id);
		if (!existedChallenge) {
			throw new NotFoundException(ChallengeErrorMessages.NOT_FOUND);
		}
		return this.challengeRepository.deleteById(id);
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Post(':id/start')
	async startChallenge(@User() user: UserModel, @Param('id', ParseIntPipe) id: number): Promise<UserChallengeModel> {
		return this.challengeService.startChallenge(id, user.id);
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Post(':id/cancel')
	async cancelChallenge(@User() user: UserModel, @Param('id', ParseIntPipe) id: number): Promise<UserChallengeModel> {
		return this.challengeService.cancelChallenge(id, user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id/status')
	async getStatus(@User() user: UserModel, @Param('id', ParseIntPipe) id: number): Promise<IChallenge> {
		return this.challengeService.getStatus(id, user.id);
	}
}
