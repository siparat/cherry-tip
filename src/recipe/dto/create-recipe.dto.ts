import { DifficultyEnum } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';
import { CommonDtoErrors } from 'src/common/common.constants';
import { RecipeDtoErrors } from '../recipe.constants';

export class CreateRecipeDto {
	@MaxLength(40, { message: RecipeDtoErrors.MAX_LENGTH_TITLE })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	title: string;

	@MaxLength(500, { message: RecipeDtoErrors.MAX_LENGTH_DESCRIPTION })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	@IsOptional()
	description?: string;

	@IsUrl({}, { message: CommonDtoErrors.IS_NOT_URL })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	image: string;

	@IsUrl({}, { message: CommonDtoErrors.IS_NOT_URL })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	@IsOptional()
	video?: string;

	@IsInt({ message: CommonDtoErrors.IS_NOT_INT })
	@IsOptional()
	cookingTime?: number;

	@IsEnum(DifficultyEnum, { message: RecipeDtoErrors.INCORRECT_DIFFICULT })
	@IsOptional()
	difficulty?: DifficultyEnum;

	@IsNumber({}, { message: CommonDtoErrors.IS_NOT_INT })
	@Min(0, { message: CommonDtoErrors.MIN_ZERO })
	protein: number;

	@IsNumber({}, { message: CommonDtoErrors.IS_NOT_INT })
	@Min(0, { message: CommonDtoErrors.MIN_ZERO })
	fat: number;

	@IsNumber({}, { message: CommonDtoErrors.IS_NOT_INT })
	@Min(0, { message: CommonDtoErrors.MIN_ZERO })
	carbs: number;

	@IsInt({ message: CommonDtoErrors.IS_NOT_INT })
	@IsOptional()
	categoryId?: number;

	@IsInt({ message: CommonDtoErrors.IS_NOT_INT })
	@IsOptional()
	dietsTypeId?: number;

	@IsInt({ message: CommonDtoErrors.IS_NOT_INT })
	@IsOptional()
	preparationId?: number;
}
