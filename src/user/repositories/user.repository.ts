import { Injectable } from '@nestjs/common';
import { GoalModel, Prisma, ProfileModel, UnitsModel, UserModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UserEntity } from '../entities/user.entity';
import { IAccount } from '../user.interfaces';
import { randomUUID } from 'crypto';

@Injectable()
export class UserRepository {
	constructor(private database: DatabaseService) {}

	async createUser(userEntity: UserEntity): Promise<UserModel> {
		const { tgId, login, email, passwordHash, role } = userEntity.getMainInfo();
		const sql = Prisma.sql`
			INSERT INTO "UserModel"("id", "updatedAt", "tgId", "login", "email", "passwordHash", "role") VALUES (
				${randomUUID()},
				now(),
				${tgId},
				${login},
				${email},
				${passwordHash},
				${Prisma.sql`${role}::"RoleEnum"`}
			)
			RETURNING *
		`;
		const [user] = await this.database.$queryRaw<UserModel[]>(sql);
		return user;
	}

	async findByEmail(email: string): Promise<UserModel | null> {
		const sql = Prisma.sql`
			SELECT * FROM "UserModel"
			WHERE email = ${email}
			LIMIT 1
		`;
		const [user] = await this.database.$queryRaw<UserModel[]>(sql);
		return user || null;
	}

	async findUniqueUser(email?: string, login?: string, tgId?: number): Promise<UserModel | null> {
		const sql = Prisma.sql`
			SELECT * FROM "UserModel"
			WHERE 
				${email ? Prisma.sql`"email" ILIKE ${email}` : Prisma.sql``}
				${email ? Prisma.sql`OR "login" ILIKE ${login}` : Prisma.sql``}
				${email ? Prisma.sql`OR "tgId" = ${tgId}` : Prisma.sql``}
			LIMIT 1
		`;
		const [user] = await this.database.$queryRaw<UserModel[]>(sql);
		return user || null;
	}

	async findByTgId(tgId: number): Promise<UserModel | null> {
		const sql = Prisma.sql`
			SELECT * FROM "UserModel"
			WHERE "tgId" = ${tgId}
			LIMIT 1
		`;
		const [user] = await this.database.$queryRaw<UserModel[]>(sql);
		return user || null;
	}

	async findAccountById(id: string): Promise<IAccount | null> {
		const sql = Prisma.sql`
			SELECT * FROM "UserModel" as u
			LEFT JOIN "ProfileModel" p ON u.id = p."userId"
			LEFT JOIN "UnitsModel" un ON u.id = un."userId"
			LEFT JOIN "GoalModel" g ON u.id = g."userId"
			WHERE id = ${id}
		`;
		const [user] = await this.database.$queryRaw<(UserModel & ProfileModel & UnitsModel & GoalModel)[]>(sql);
		if (!user) {
			return null;
		}
		const account: IAccount = {
			id: user.id,
			tgId: user.tgId,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			email: user.email,
			login: user.login,
			role: user.role,
			passwordHash: user.passwordHash,
			profile: !user.firstName
				? null
				: {
						firstName: user.firstName,
						lastName: user.lastName,
						birth: user.birth,
						city: user.city,
						sex: user.sex
					},
			units: !user.weight
				? null
				: {
						weight: user.weight,
						height: user.height,
						bloodGlucose: user.bloodGlucose,
						targetWeight: user.targetWeight
					},
			goal: !user.type
				? null
				: {
						type: user.type,
						activity: user.activity,
						calorieGoal: user.calorieGoal
					}
		};
		return account;
	}

	async deleteById(id: string): Promise<UserModel> {
		const sql = Prisma.sql`
			DELETE FROM "UserModel"
			WHERE id = ${id}
			RETURNING *
		`;
		const [user] = await this.database.$queryRaw<UserModel[]>(sql);
		return user || null;
	}
}
