import {
	Body,
	ConflictException,
	Controller,
	Get,
	NotFoundException,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { ProfileModel, UserModel } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { IAccount } from './user.interfaces';
import { UserRepository } from './repositories/user.repository';
import { UserErrorMessages } from './user.constants';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UserService } from './user.service';
import { ProfileRepository } from './repositories/profile.repository';

@Controller('user')
export class UserController {
	constructor(
		private userRepository: UserRepository,
		private profileRepository: ProfileRepository,
		private userService: UserService
	) {}

	@UseGuards(JwtAuthGuard)
	@Get('account')
	async info(@User() { id }: UserModel): Promise<IAccount> {
		const account = await this.userRepository.findAccountById(id);
		if (!account) {
			throw new NotFoundException(UserErrorMessages.NOT_FOUND);
		}
		return account;
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	@Post('profile')
	async createProfile(@User() { id }: UserModel, @Body() dto: CreateUserProfileDto): Promise<ProfileModel> {
		const existedProfile = await this.profileRepository.findByUserId(id);
		if (existedProfile) {
			throw new ConflictException(UserErrorMessages.PROFILE_ALREADY_EXIST);
		}
		return this.userService.createProfile(id, dto);
	}
}
