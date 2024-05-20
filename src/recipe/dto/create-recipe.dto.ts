import { DifficultyEnum } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength } from 'class-validator';
import { CommonDtoErrors } from 'src/common/common.constants';
import { RecipeDtoErrors } from '../recipe.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDto {
	@ApiProperty({ minLength: 1, maxLength: 40 })
	@MaxLength(40, { message: RecipeDtoErrors.MAX_LENGTH_TITLE })
	@MinLength(1, { message: RecipeDtoErrors.MAX_LENGTH_TITLE })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	title: string;

	@ApiProperty({ minLength: 100, maxLength: 500 })
	@MaxLength(500, { message: RecipeDtoErrors.MAX_LENGTH_DESCRIPTION })
	@MaxLength(100, { message: RecipeDtoErrors.MIN_LENGTH_DESCRIPTION })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	@IsOptional()
	description?: string;

	@ApiProperty({ description: 'URL на фото' })
	@IsUrl({}, { message: CommonDtoErrors.IS_NOT_URL })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	image: string;

	@ApiProperty({ description: 'URL на видео (необязательно)' })
	@IsUrl({}, { message: CommonDtoErrors.IS_NOT_URL })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	@IsOptional()
	video?: string;

	@ApiProperty({ description: 'Время приготовления в минутах (необязательно)' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT })
	@IsOptional()
	cookingTime?: number;

	@ApiProperty({ enum: DifficultyEnum, default: null, description: 'Сложность (необязательно)' })
	@IsEnum(DifficultyEnum, { message: RecipeDtoErrors.INCORRECT_DIFFICULT })
	@IsOptional()
	difficulty?: DifficultyEnum;

	@ApiProperty({ minimum: 0, description: 'Белка в 100г' })
	@IsNumber({}, { message: CommonDtoErrors.IS_NOT_NUMBER })
	@Min(0, { message: CommonDtoErrors.MIN_ZERO })
	protein: number;

	@ApiProperty({ minimum: 0, description: 'Жиров в 100г' })
	@IsNumber({}, { message: CommonDtoErrors.IS_NOT_NUMBER })
	@Min(0, { message: CommonDtoErrors.MIN_ZERO })
	fat: number;

	@ApiProperty({ minimum: 0, description: 'Углеводов в 100г' })
	@IsNumber({}, { message: CommonDtoErrors.IS_NOT_NUMBER })
	@Min(0, { message: CommonDtoErrors.MIN_ZERO })
	carbs: number;

	@ApiProperty({ description: 'Id категории (необязательно)' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT })
	@IsOptional()
	categoryId?: number;

	@ApiProperty({ description: 'Id вида диеты (необязательно)' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT })
	@IsOptional()
	dietsTypeId?: number;

	@ApiProperty({ description: 'Id способа приготовления (необязательно)' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT })
	@IsOptional()
	preparationId?: number;
}
