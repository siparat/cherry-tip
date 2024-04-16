import { SexEnum } from '@prisma/client';
import { IProfileEntity } from '../user.interfaces';

export class ProfileEntity {
	firstName: string;
	lastName?: string;
	birth: Date;
	sex: SexEnum;
	city?: string;
	userId: string;

	constructor({ firstName, lastName, birth, sex, city, userId }: IProfileEntity) {
		this.firstName = firstName;
		this.lastName = lastName ?? undefined;
		this.birth = typeof birth == 'string' ? new Date(birth) : birth;
		this.sex = sex;
		this.city = city ?? undefined;
		this.userId = userId;
	}
}
