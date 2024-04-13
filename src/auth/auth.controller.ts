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
	async login(@Body() dto: AuthLoginDto): Promise<string> {
		const userIsValid = await this.authService.validateUser(dto);
		if (!userIsValid) {
			throw new BadRequestException(AuthErrorMessages.WRONG_PASSWORD);
		}
		return this.authService.generateJwtToken({ email: dto.email });
	}
}
