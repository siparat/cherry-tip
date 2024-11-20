import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { GoalModel, ProfileModel, UnitsModel, UserModel } from '@prisma/client';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { ProfileEntity } from './entities/profile.entity';
import { ProfileRepository } from './repositories/profile.repository';
import { CreateUserUnitsDto } from './dto/create-user-units.dto';
import { UnitsEntity } from './entities/units.entity';
import { UnitsRepository } from './repositories/units.repository';
import { CreateUserGoalDto } from './dto/create-user-goal.dto';
import { UserEntity } from './entities/user.entity';
import { GoalRepository } from './repositories/goal.repository';
import { UserErrorMessages } from './user.constants';
import { GoalEntity } from './entities/goal.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
	constructor(
		private userRepository: UserRepository,
		private profileRepository: ProfileRepository,
		private unitsRepository: UnitsRepository,
		private goalRepository: GoalRepository,
		private logger: Logger
	) {}

	async createProfile(userId: string, dto: CreateUserProfileDto): Promise<ProfileModel> {
		const entity = new ProfileEntity({ ...dto, userId });
		const profile = await this.profileRepository.createProfile(entity);
		this.logger.log(`User ${userId} has created his profile`);
		return profile;
	}

	async updateProfile(oldProfile: ProfileModel, dto: CreateUserProfileDto): Promise<ProfileModel> {
		const entity = new ProfileEntity({ ...oldProfile, ...dto });
		const profile = await this.profileRepository.updateProfile(oldProfile.userId, entity);
		const userEntity = await this.getUserEntity(oldProfile.userId);
		if (!userEntity?.goal) {
			throw new UnprocessableEntityException(UserErrorMessages.GOAL_IS_REQUIRED);
		}
		const goalEntity = new GoalEntity({ ...userEntity.goal, user: userEntity });
		await this.goalRepository.updateGoal(entity.userId, goalEntity);
		this.logger.log(`User ${entity.userId} has updated his profile`);
		return profile;
	}

	async createUnitsModel(userId: string, dto: CreateUserUnitsDto): Promise<UnitsModel> {
		const entity = new UnitsEntity({ ...dto, userId });
		const units = await this.unitsRepository.createUnitsModel(entity);
		this.logger.log(`User ${userId} has filled in his units`);
		return units;
	}

	async updateUnitsModel(oldUnitsModel: UnitsModel, dto: CreateUserUnitsDto): Promise<UnitsModel> {
		const entity = new UnitsEntity({ ...oldUnitsModel, ...dto });
		const unitsModel = await this.unitsRepository.updateUnitsModel(oldUnitsModel.userId, entity);
		const userEntity = await this.getUserEntity(oldUnitsModel.userId);
		if (!userEntity?.goal) {
			throw new UnprocessableEntityException(UserErrorMessages.GOAL_IS_REQUIRED);
		}
		const goalEntity = new GoalEntity({ ...userEntity.goal, user: userEntity });
		await this.goalRepository.updateGoal(entity.userId, goalEntity);
		this.logger.log(`User ${entity.userId} has updated his units`);
		return unitsModel;
	}

	async createGoal(user: UserModel, dto: CreateUserGoalDto): Promise<GoalModel> {
		const profile = await this.profileRepository.findByUserId(user.id);
		const units = await this.unitsRepository.findByUserId(user.id);
		if (!units) {
			throw new UnprocessableEntityException(UserErrorMessages.UNITS_IS_REQUIRED);
		}
		if (!profile) {
			throw new UnprocessableEntityException(UserErrorMessages.PROFILE_IS_REQUIRED);
		}
		const unitsEntity = new UnitsEntity(units);
		const profileEntity = new ProfileEntity(profile);
		const userEntity = new UserEntity(user).setProfile(profileEntity).setUnits(unitsEntity);
		const entity = new GoalEntity({ ...dto, user: userEntity });
		const goal = await this.goalRepository.createGoal(entity);
		this.logger.log(`User ${user.id} has set his goal`);
		return goal;
	}

	async updateGoal(oldGoal: GoalModel, dto: CreateUserGoalDto): Promise<GoalModel> {
		const userEntity = await this.getUserEntity(oldGoal.userId);
		if (!userEntity) {
			throw new NotFoundException(UserErrorMessages.NOT_FOUND);
		}
		const entity = new GoalEntity({ ...oldGoal, ...dto, user: userEntity });
		this.logger.log(`User ${entity.userId} has updated his goal`);
		return this.goalRepository.updateGoal(oldGoal.userId, entity);
	}

	async getUserEntity(userId: string): Promise<UserEntity | null> {
		const user = await this.userRepository.findAccountById(userId);
		if (!user) {
			return null;
		}
		const entity = new UserEntity(user);
		if (user.profile) {
			entity.setProfile(new ProfileEntity({ ...user.profile, userId: user.id }));
		}
		if (user.units) {
			entity.setUnits(new UnitsEntity({ ...user.units, userId: user.id }));
		}
		if (user.goal) {
			entity.setGoal(new GoalEntity({ ...user.goal, user: entity }));
		}
		return entity;
	}
}
