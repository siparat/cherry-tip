import { ProfileModel, UnitsModel, UserModel } from '@prisma/client';
import { PartialFields } from 'types/partial-fields.type';

export type IUserEntity = Omit<PartialFields<UserModel, 'id'>, 'createdAt' | 'updatedAt'>;

export type IProfileEntity = Omit<ProfileModel, 'birth'> &
	PartialFields<ProfileModel, 'lastName' | 'city'> & {
		birth: Date | string;
	};

export type IUnitsEntity = PartialFields<UnitsModel, 'bloodGlucose'>;

export type IAccount = UserModel & {
	profile: Omit<ProfileModel, 'userId'> | null;
	units: Omit<UnitsModel, 'userId'> | null;
};
