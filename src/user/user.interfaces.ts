import { UserModel } from '@prisma/client';

export type IUserEntity = Omit<UserModel, 'id'> & Partial<Pick<UserModel, 'id'>>;
