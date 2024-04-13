import { ProfileModel, UserModel } from '@prisma/client';

export type IUserEntity = Omit<UserModel, 'id'> & Partial<Pick<UserModel, 'id'>>;
export type IProfileEntity = Omit<ProfileModel, 'birth'> & { birth: Date | string };

export type IAccount = UserModel & { profile: ProfileModel | null };
