import { Injectable } from '@nestjs/common';
import { ProfileModel, UnitsModel } from '@prisma/client';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { ProfileEntity } from './entities/profile.entity';
import { ProfileRepository } from './repositories/profile.repository';
import { CreateUserUnitsDto } from './dto/create-user-units.dto';
import { UnitsEntity } from './entities/units.entity';
import { UnitsRepository } from './repositories/units.repository';

@Injectable()
export class UserService {
	constructor(
		private profileRepository: ProfileRepository,
		private unitsRepository: UnitsRepository
	) {}

	async createProfile(userId: string, dto: CreateUserProfileDto): Promise<ProfileModel> {
		const entity = new ProfileEntity({ ...dto, userId });
		return this.profileRepository.createProfile(entity);
	}

	async createUnitsModel(userId: string, dto: CreateUserUnitsDto): Promise<UnitsModel> {
		const entity = new UnitsEntity({ ...dto, userId });
		return this.unitsRepository.createUnitsModel(entity);
	}
}
