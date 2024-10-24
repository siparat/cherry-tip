import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { AuthDtoErrors } from '../auth.constants';
import { CommonDtoErrors } from 'src/common/common.constants';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
	@ApiProperty({ example: 'a@a.ru' })
	@IsEmail({}, { message: CommonDtoErrors.IS_NOT_EMAIL.ru })
	email: string;

	@ApiProperty({ minLength: 4, maxLength: 24 })
	@Matches(/^[0-9a-zA-Z!@#.$%^&*()_+|\-=]{1,}$/, {
		message: AuthDtoErrors.INVALID_SYMBOLS.ru
	})
	@MinLength(4, { message: AuthDtoErrors.MIN_LENGTH_PASSWORD.ru })
	@MaxLength(24, { message: AuthDtoErrors.MAX_LENGTH_PASSWORD.ru })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.ru })
	password: string;
}
