import { ProfileModel, UnitsModel, UserModel } from '@prisma/client';

export type IUserEntity = Omit<UserModel, 'id'> & Partial<Pick<UserModel, 'id'>>;

export type IProfileEntity = Omit<ProfileModel, 'birth'> & {
	birth: Date | string;
	lastName?: ProfileModel['lastName'];
	city?: ProfileModel['city'];
};

export type IUnitsEntity = Omit<UnitsModel, 'bloodGlucose'> & { bloodGlucose?: UnitsModel['bloodGlucose'] };

export type IAccount = UserModel & {
	profile: Omit<ProfileModel, 'userId'> | null;
	units: Omit<UnitsModel, 'userId'> | null;
};
