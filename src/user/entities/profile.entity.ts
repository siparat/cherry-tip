import { SexEnum } from '@prisma/client';
import { IProfileEntity } from '../user.interfaces';

export class ProfileEntity {
	firstName: string;
	lastName?: string | null;
	birth: Date;
	sex: SexEnum;
	city?: string | null;
	userId: string;

	constructor({ firstName, lastName, birth, sex, city, userId }: IProfileEntity) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.birth = typeof birth == 'string' ? new Date(birth) : birth;
		this.sex = sex;
		this.city = city;
		this.userId = userId;
	}
}
