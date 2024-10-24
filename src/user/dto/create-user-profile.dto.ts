import { SexEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, MinDate, MaxDate, IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { UserDtoErrors } from '../user.constants';
import { CommonDtoErrors } from 'src/common/common.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserProfileDto {
	@ApiProperty({ maxLength: 20 })
	@MaxLength(20, { message: UserDtoErrors.MAX_LENGTH_NAME.ru })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.ru })
	firstName: string;

	@ApiProperty({ maxLength: 20, type: String, description: 'Фамилия (необязательно)' })
	@MaxLength(20, { message: UserDtoErrors.MAX_LENGTH_NAME.ru })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.ru })
	@IsOptional()
	lastName: string | null;

	@ApiProperty({
		maxLength: 20,
		description: 'Дата в формате ISO8601, минимальная дата – 1900-01-01, максимальная дата – текущая (необязательно)'
	})
	@MinDate(new Date(1900, 0, 1), { message: UserDtoErrors.MIN_DATE_BIRTH.ru })
	@MaxDate(new Date(), { message: UserDtoErrors.MAX_DATE_BIRTH.ru })
	@IsDate({ message: CommonDtoErrors.IS_NOT_DATE.ru })
	@Type(() => Date)
	birth: Date;

	@ApiProperty({ maxLength: 20, type: String, description: 'Город (необязательно)' })
	@MaxLength(20, { message: UserDtoErrors.MAX_LENGTH_CITYNAME.ru })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.ru })
	@IsOptional()
	city: string | null;

	@ApiProperty({ enum: SexEnum })
	@IsEnum(SexEnum, { message: UserDtoErrors.INVALID_SEX.ru })
	sex: SexEnum;
}
