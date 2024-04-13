import { SexEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, MinDate, MaxDate, IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { UserDtoErrors } from '../user.constants';

export class CreateUserProfileDto {
	@MaxLength(20, { message: UserDtoErrors.MAX_LENGTH_NAME })
	@IsString({ message: UserDtoErrors.IS_NOT_STRING })
	firstName: string;

	@MaxLength(20, { message: UserDtoErrors.MAX_LENGTH_NAME })
	@IsString({ message: UserDtoErrors.IS_NOT_STRING })
	@IsOptional()
	lastName: string | null;

	@MinDate(new Date(1900, 0, 1), { message: UserDtoErrors.MIN_DATE_BIRTH })
	@MaxDate(new Date(), { message: UserDtoErrors.MAX_DATE_BIRTH })
	@IsDate({ message: UserDtoErrors.IS_NOT_DATE })
	@Type(() => Date)
	birth: Date;

	@MaxLength(20, { message: UserDtoErrors.MAX_LENGTH_CITYNAME })
	@IsString({ message: UserDtoErrors.IS_NOT_STRING })
	@IsOptional()
	city: string | null;

	@IsEnum(SexEnum, { message: UserDtoErrors.INVALID_SEX })
	sex: SexEnum;
}
