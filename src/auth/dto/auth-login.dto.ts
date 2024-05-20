import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthDtoErrors } from '../auth.constants';
import { CommonDtoErrors } from 'src/common/common.constants';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
	@ApiProperty({ example: 'a@a.ru' })
	@IsEmail({}, { message: CommonDtoErrors.IS_NOT_EMAIL })
	email: string;

	@ApiProperty({ minLength: 4, maxLength: 24 })
	@MinLength(4, { message: AuthDtoErrors.MIN_LENGTH_PASSWORD })
	@MaxLength(24, { message: AuthDtoErrors.MAX_LENGTH_PASSWORD })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	password: string;
}
