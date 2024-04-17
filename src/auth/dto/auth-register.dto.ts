import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthDtoErrors } from '../auth.constants';
import { CommonDtoErrors } from 'src/common/common.constants';

export class AuthRegisterDto {
	@IsEmail({}, { message: CommonDtoErrors.IS_NOT_EMAIL })
	email: string;

	@MinLength(2, { message: AuthDtoErrors.MIN_LENGTH_LOGIN })
	@MaxLength(20, { message: AuthDtoErrors.MAX_LENGTH_LOGIN })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	login: string;

	@MinLength(4, { message: AuthDtoErrors.MIN_LENGTH_PASSWORD })
	@MaxLength(24, { message: AuthDtoErrors.MAX_LENGTH_PASSWORD })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	password: string;
}
