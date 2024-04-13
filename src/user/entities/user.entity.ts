import { compare, hash } from 'bcrypt';
import { IUserEntity } from '../user.interfaces';

export class UserEntity {
	id?: string;
	email: string;
	passwordHash: string;
	login: string;

	constructor({ id, login, email, passwordHash }: IUserEntity) {
		this.id = id;
		this.email = email;
		this.passwordHash = passwordHash;
		this.login = login;
	}

	async setPassword(password: string): Promise<this> {
		const salt = 6;
		this.passwordHash = await hash(password, salt);
		return this;
	}

	comparePassword(password: string): Promise<boolean> {
		return compare(password, this.passwordHash);
	}
}
