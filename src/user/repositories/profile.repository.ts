import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProfileEntity } from '../entities/profile.entity';
import { ProfileModel } from '@prisma/client';

@Injectable()
export class ProfileRepository {
	constructor(private database: DatabaseService) {}

	createProfile(profile: ProfileEntity): Promise<ProfileModel> {
		return this.database.profileModel.create({ data: profile });
	}

	updateProfile(userId: string, profile: ProfileEntity): Promise<ProfileModel> {
		return this.database.profileModel.update({ where: { userId }, data: profile });
	}

	findByUserId(userId: string): Promise<ProfileModel | null> {
		return this.database.profileModel.findUnique({ where: { userId } });
	}
}
