import { GoalModel, ProfileModel, UnitsModel, UserModel } from '@prisma/client';
import { PartialFields } from 'types/partial-fields.type';
import { UserEntity } from './entities/user.entity';

export type IUserEntity = Omit<PartialFields<UserModel, 'id'>, 'createdAt' | 'updatedAt'>;

export type IProfileEntity = Omit<ProfileModel, 'birth'> &
	PartialFields<ProfileModel, 'lastName' | 'city'> & {
		birth: Date | string;
	};

export type IUnitsEntity = PartialFields<UnitsModel, 'bloodGlucose' | 'targetWeight'>;

export type IAccount = UserModel & {
	profile: Omit<ProfileModel, 'userId'> | null;
	units: Omit<UnitsModel, 'userId'> | null;
	goal: Omit<GoalModel, 'userId'> | null;
};

export type IGoalEntity = Omit<GoalModel, 'calorieGoal' | 'userId'> & { user: UserEntity };
