import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth.interfaces';
import { UserModel } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/user/repositories/user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthErrorMessages } from '../auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private userRepository: UserRepository,
		config: ConfigService
	) {
		super({
			secretOrKey: config.get('SECRET'),
			ignoreExpiration: true,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
		});
	}

	async validate({ email }: JwtPayload): Promise<UserModel> {
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			throw new NotFoundException(AuthErrorMessages.NOT_FOUND);
		}
		return user;
	}
}
