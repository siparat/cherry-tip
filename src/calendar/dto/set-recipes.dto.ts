import { CategoryEnum } from '@prisma/client';
import { IsArray, IsDate, IsEnum, IsInt, MaxDate } from 'class-validator';
import { CommonDtoErrors } from 'src/common/common.constants';
import { CalendarDtoErrors } from '../calendar.constants';
import { Type } from 'class-transformer';

export class SetRecipesDto {
	@MaxDate(new Date(), { message: CommonDtoErrors.INVALID_DATE })
	@IsDate({ message: CommonDtoErrors.IS_NOT_DATE })
	@Type(() => Date)
	date: Date;

	@IsEnum(CategoryEnum, { message: CalendarDtoErrors.INVALID_CATEGORY })
	category: CategoryEnum;

	@IsInt({ each: true, message: CommonDtoErrors.IS_NOT_INT })
	@IsArray({ message: CommonDtoErrors.IS_NOT_ARRAY })
	recipes: number[];
}
