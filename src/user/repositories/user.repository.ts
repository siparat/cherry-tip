import { Injectable } from '@nestjs/common';
import { UserModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UserEntity } from '../entities/user.entity';
import { IAccount } from '../user.interfaces';
import { excludeProperty } from 'src/helpers/object.helpers';

@Injectable()
export class UserRepository {
	constructor(private database: DatabaseService) {}

	createUser(userEntity: UserEntity): Promise<UserModel> {
		return this.database.userModel.create({ data: userEntity.getMainInfo() });
	}

	findByEmail(email: string): Promise<UserModel | null> {
		return this.database.userModel.findUnique({ where: { email } });
	}

	findUniqueUser(email?: string, login?: string, tgId?: number): Promise<UserModel | null> {
		return this.database.userModel.findFirst({
			where: {
				OR: [
					{ email: { mode: 'insensitive', equals: email } },
					{ login: { mode: 'insensitive', equals: login } },
					{ tgId }
				]
			}
		});
	}

	findByTgId(tgId: number): Promise<UserModel | null> {
		return this.database.userModel.findUnique({ where: { tgId } });
	}

	async findAccountById(id: string): Promise<IAccount | null> {
		const account = await this.database.userModel.findUnique({
			where: { id },
			include: { profile: true, units: true, goal: true }
		});
		if (!account) {
			return account;
		}

		const units = account.units ? excludeProperty(account.units, 'userId') : null;
		const profile = account.profile ? excludeProperty(account.profile, 'userId') : null;
		const goal = account.goal ? excludeProperty(account.goal, 'userId') : null;

		return { ...account, profile, units, goal };
	}

	deleteById(id: string): Promise<UserModel> {
		return this.database.userModel.delete({ where: { id } });
	}
}
