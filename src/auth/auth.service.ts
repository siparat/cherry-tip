import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthErrorMessages } from './auth.constants';
import { RoleEnum, UserModel } from '@prisma/client';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtPayload } from './auth.interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private userRepository: UserRepository,
		private jwtService: JwtService,
		private logger: Logger
	) {}

	async createUser({ email, login, password }: AuthRegisterDto, tgId?: number): Promise<UserModel> {
		const existedUser = await this.userRepository.findUniqueUser(email, login, tgId);
		if (existedUser) {
			throw new ConflictException(AuthErrorMessages.ALREADY_EXIST);
		}
		const entity = new UserEntity({ email, login, passwordHash: '', role: RoleEnum.User, tgId });
		await entity.setPassword(password);
		const user = await this.userRepository.createUser(entity);
		this.logger.log(`User ${user.id} has been successfully registered`);
		return user;
	}

	async validateUser({ email, password }: AuthLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.findByEmail(email);
		if (!existedUser) {
			throw new NotFoundException(AuthErrorMessages.NOT_FOUND);
		}
		const entity = new UserEntity(existedUser);
		const isValid = await entity.comparePassword(password);
		if (isValid) {
			this.logger.log(`User ${existedUser.id} has been logged in`);
		}
		return isValid;
	}

	async authenticationToken(token: string): Promise<JwtPayload | null> {
		try {
			return await this.jwtService.verifyAsync<JwtPayload>(token);
		} catch (error) {
			return null;
		}
	}

	async generateJwtToken(payload: JwtPayload): Promise<string> {
		return this.jwtService.signAsync(payload);
	}
}
