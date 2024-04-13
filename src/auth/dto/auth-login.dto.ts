import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthDtoErrors } from '../auth.constants';

export class AuthLoginDto {
	@IsEmail({}, { message: AuthDtoErrors.IS_NOT_EMAIL })
	email: string;

	@MinLength(4, { message: AuthDtoErrors.MIN_LENGTH_PASSWORD })
	@MaxLength(24, { message: AuthDtoErrors.MAX_LENGTH_PASSWORD })
	@IsString({ message: AuthDtoErrors.IS_NOT_STRING })
	password: string;
}
