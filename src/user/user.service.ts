import { Injectable } from '@nestjs/common';
import { ProfileModel } from '@prisma/client';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { ProfileEntity } from './entities/profile.entity';
import { ProfileRepository } from './repositories/profile.repository';

@Injectable()
export class UserService {
	constructor(private profileRepository: ProfileRepository) {}

	async createProfile(userId: string, dto: CreateUserProfileDto): Promise<ProfileModel> {
		const entity = new ProfileEntity({ ...dto, userId });
		const profile = this.profileRepository.createProfile(entity);
		return profile;
	}
}
