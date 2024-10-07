import { CategoryEnum } from '@prisma/client';
import { IsArray, IsDate, IsEnum, IsInt, MaxDate } from 'class-validator';
import { CommonDtoErrors } from 'src/common/common.constants';
import { CalendarDtoErrors } from '../calendar.constants';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SetRecipesDto {
	@ApiProperty({ description: 'Дата в формате ISO8601 ' })
	@IsDate({ message: CommonDtoErrors.IS_NOT_DATE.en })
	@Type(() => Date)
	date: Date;

	@ApiProperty({ enum: CategoryEnum })
	@IsEnum(CategoryEnum, { message: CalendarDtoErrors.INVALID_CATEGORY.en })
	category: CategoryEnum;

	@ApiProperty({ type: String, isArray: true, description: 'Массив id рецептов' })
	@IsInt({ each: true, message: CommonDtoErrors.IS_NOT_INT.en })
	@IsArray({ message: CommonDtoErrors.IS_NOT_ARRAY.en })
	recipes: number[];
}
