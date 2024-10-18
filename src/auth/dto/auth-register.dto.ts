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
	@IsEmail({}, { message: CommonDtoErrors.IS_NOT_EMAIL.en })
	email: string;

	@ApiProperty({ minLength: 2, maxLength: 20 })
	@IsAlphanumeric('en-US', { message: CommonDtoErrors.LATIN_ONLY.en })
	@MinLength(2, { message: AuthDtoErrors.MIN_LENGTH_LOGIN.en })
	@MaxLength(20, { message: AuthDtoErrors.MAX_LENGTH_LOGIN.en })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.en })
	login: string;

	@ApiProperty({ minLength: 4, maxLength: 24 })
	@Matches(/^[0-9a-zA-Z!@#.$%^&*()_+|\-=]{1,}$/, {
		message: AuthDtoErrors.INVALID_SYMBOLS.en
	})
	@MinLength(4, { message: AuthDtoErrors.MIN_LENGTH_PASSWORD.en })
	@MaxLength(24, { message: AuthDtoErrors.MAX_LENGTH_PASSWORD.en })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.en })
	password: string;
}
