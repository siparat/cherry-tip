import { Injectable } from '@nestjs/common';
import { UserModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
	constructor(private database: DatabaseService) {}

	createUser(userEntity: UserEntity): Promise<UserModel> {
		return this.database.userModel.create({ data: userEntity });
	}

	findByEmail(email: string): Promise<UserModel | null> {
		return this.database.userModel.findUnique({ where: { email } });
	}

	findUniqueUser(email?: string, login?: string): Promise<UserModel | null> {
		return this.database.userModel.findFirst({
			where: {
				OR: [{ email: { mode: 'insensitive', equals: email } }, { login: { mode: 'insensitive', equals: login } }]
			}
		});
	}

	deleteById(id: string): Promise<UserModel> {
		return this.database.userModel.delete({ where: { id } });
	}
}
