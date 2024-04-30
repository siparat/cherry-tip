import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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

@Injectable()
export class UserService {
	constructor(
		private profileRepository: ProfileRepository,
		private unitsRepository: UnitsRepository,
		private goalRepository: GoalRepository
	) {}

	async createProfile(userId: string, dto: CreateUserProfileDto): Promise<ProfileModel> {
		const entity = new ProfileEntity({ ...dto, userId });
		return this.profileRepository.createProfile(entity);
	}

	async createUnitsModel(userId: string, dto: CreateUserUnitsDto): Promise<UnitsModel> {
		const entity = new UnitsEntity({ ...dto, userId });
		return this.unitsRepository.createUnitsModel(entity);
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
		return this.goalRepository.createUnitsModel(entity);
	}
}
