import { IsAlphanumeric, IsEmail, IsEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { AuthDtoErrors } from '../auth.constants';
import { CommonDtoErrors } from 'src/common/common.constants';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterDto {
	@IsEmpty()
	id?: number;

	@IsEmpty()
	createdAt?: Date;

	@IsEmpty()
	updatedAt?: Date;

	@ApiProperty({ example: 'a@a.ru' })
	@IsEmail({}, { message: CommonDtoErrors.IS_NOT_EMAIL.ru })
	email: string;

	@ApiProperty({ minLength: 2, maxLength: 20 })
	@IsAlphanumeric('en-US', { message: CommonDtoErrors.LATIN_ONLY.ru })
	@MinLength(2, { message: AuthDtoErrors.MIN_LENGTH_LOGIN.ru })
	@MaxLength(20, { message: AuthDtoErrors.MAX_LENGTH_LOGIN.ru })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.ru })
	login: string;

	@ApiProperty({ minLength: 4, maxLength: 24 })
	@Matches(/^[0-9a-zA-Z!@#.$%^&*()_+|\-=]{1,}$/, {
		message: AuthDtoErrors.INVALID_SYMBOLS.ru
	})
	@MinLength(4, { message: AuthDtoErrors.MIN_LENGTH_PASSWORD.ru })
	@MaxLength(24, { message: AuthDtoErrors.MAX_LENGTH_PASSWORD.ru })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.ru })
	password: string;
}
