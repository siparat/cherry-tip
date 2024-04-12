import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { UserModel } from '.prisma/client';

@Controller('auth')
export class AuthController {
	@UseGuards(JwtAuthGuard)
	@Get('info')
	info(@User() user: UserModel): UserModel {
		return user;
	}
}
