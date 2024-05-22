import {
	Body,
	ConflictException,
	Controller,
	Get,
	NotFoundException,
	Post,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { GoalModel, ProfileModel, UnitsModel, UserModel } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { IAccount } from './user.interfaces';
import { UserRepository } from './repositories/user.repository';
import { UserErrorMessages } from './user.constants';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UserService } from './user.service';
import { ProfileRepository } from './repositories/profile.repository';
import { CreateUserUnitsDto } from './dto/create-user-units.dto';
import { UnitsRepository } from './repositories/units.repository';
import { CreateUserGoalDto } from './dto/create-user-goal.dto';
import { GoalRepository } from './repositories/goal.repository';

@Controller('user')
export class UserController {
	constructor(
		private userRepository: UserRepository,
		private profileRepository: ProfileRepository,
		private unitsRepository: UnitsRepository,
		private goalRepository: GoalRepository,
		private userService: UserService
	) {}

	@UseGuards(JwtAuthGuard)
	@Get('account')
	async info(@User() { id }: UserModel): Promise<IAccount> {
		const account = await this.userRepository.findAccountById(id);
		if (!account) {
			throw new NotFoundException(UserErrorMessages.NOT_FOUND);
		}
		return account;
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	@Post('profile')
	async createProfile(@User() { id }: UserModel, @Body() dto: CreateUserProfileDto): Promise<ProfileModel> {
		const existedProfile = await this.profileRepository.findByUserId(id);
		if (existedProfile) {
			throw new ConflictException(UserErrorMessages.PROFILE_ALREADY_EXIST);
		}
		return this.userService.createProfile(id, dto);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	@Put('profile')
	async updateProfile(@User() { id }: UserModel, @Body() dto: CreateUserProfileDto): Promise<ProfileModel> {
		const existedProfile = await this.profileRepository.findByUserId(id);
		if (!existedProfile) {
			throw new NotFoundException(UserErrorMessages.PROFILE_IS_REQUIRED);
		}
		return this.userService.updateProfile(existedProfile, dto);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	@Post('units')
	async createUnitsModel(@User() { id }: UserModel, @Body() dto: CreateUserUnitsDto): Promise<UnitsModel> {
		const existedUnitsModel = await this.unitsRepository.findByUserId(id);
		if (existedUnitsModel) {
			throw new ConflictException(UserErrorMessages.UNITS_MODEL_ALREADY_EXIST);
		}
		return this.userService.createUnitsModel(id, dto);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	@Put('units')
	async updateUnitsModel(@User() { id }: UserModel, @Body() dto: CreateUserUnitsDto): Promise<UnitsModel> {
		const existedUnitsModel = await this.unitsRepository.findByUserId(id);
		if (!existedUnitsModel) {
			throw new NotFoundException(UserErrorMessages.UNITS_IS_REQUIRED);
		}
		return this.userService.updateUnitsModel(existedUnitsModel, dto);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	@Post('goal')
	async createGoal(@User() user: UserModel, @Body() dto: CreateUserGoalDto): Promise<GoalModel> {
		const existedGoal = await this.goalRepository.findByUserId(user.id);
		if (existedGoal) {
			throw new ConflictException(UserErrorMessages.GOAL_ALREADY_EXIST);
		}
		return this.userService.createGoal(user, dto);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	@Put('goal')
	async updateGoal(@User() user: UserModel, @Body() dto: CreateUserGoalDto): Promise<GoalModel> {
		const existedGoal = await this.goalRepository.findByUserId(user.id);
		if (!existedGoal) {
			throw new NotFoundException(UserErrorMessages.GOAL_IS_REQUIRED);
		}
		return this.userService.updateGoal(existedGoal, dto);
	}
}
