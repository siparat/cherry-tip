import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProfileEntity } from '../entities/profile.entity';
import { Prisma, ProfileModel } from '@prisma/client';

@Injectable()
export class ProfileRepository {
	constructor(private database: DatabaseService) {}

	async createProfile(profileEntity: ProfileEntity): Promise<ProfileModel> {
		const { firstName, lastName, birth, city, sex, userId } = profileEntity;
		const sql = Prisma.sql`
			INSERT INTO "ProfileModel"("firstName", "lastName", "birth", "city", "sex", "userId") VALUES (
				${firstName},
				${lastName || null},
				${birth},
				${city || null},
				${Prisma.sql`${sex}::"SexEnum"`},
				${userId}
			)
			RETURNING *
		`;
		const [profile] = await this.database.$queryRaw<ProfileModel[]>(sql);
		return profile;
	}

	async updateProfile(userId: string, profileEntity: ProfileEntity): Promise<ProfileModel> {
		const sql = Prisma.sql`
			UPDATE "ProfileModel"
			SET
				"firstName" = ${profileEntity.firstName},
				"lastName" = ${profileEntity.lastName},
				"birth" = ${profileEntity.birth},
				"city" = ${profileEntity.city},
				"sex" = ${Prisma.sql`${profileEntity.sex}::"SexEnum"`},
				"userId" = ${profileEntity.userId}
			WHERE "userId" = ${userId}
			RETURNING *
		`;
		const [profile] = await this.database.$queryRaw<ProfileModel[]>(sql);
		return profile;
	}

	async findByUserId(userId: string): Promise<ProfileModel | null> {
		const sql = Prisma.sql`
			SELECT * FROM "ProfileModel"
			WHERE 
				"userId" = ${userId}
			LIMIT 1
		`;
		const [profile] = await this.database.$queryRaw<ProfileModel[]>(sql);
		return profile || null;
	}
}
