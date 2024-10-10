import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserModel } from '@prisma/client';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthErrorMessages } from './auth.constants';
import { LoginResponse } from './auth.interfaces';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UsePipes(ValidationPipe)
	@Post('register')
	async register(@Body() dto: AuthRegisterDto): Promise<UserModel> {
		return this.authService.createUser(dto);
	}

	@UsePipes(ValidationPipe)
	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(@Body() dto: AuthLoginDto): Promise<LoginResponse> {
		const userIsValid = await this.authService.validateUser(dto);
		if (!userIsValid) {
			throw new BadRequestException(AuthErrorMessages.WRONG_PASSWORD);
		}
		const token = await this.authService.generateJwtToken({ email: dto.email });
		return { token };
	}
}
