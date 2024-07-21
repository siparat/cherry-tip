import { DifficultyEnum } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength } from 'class-validator';
import { CommonDtoErrors } from 'src/common/common.constants';
import { RecipeDtoErrors } from '../recipe.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDto {
	@ApiProperty({ minLength: 1, maxLength: 40 })
	@MaxLength(40, { message: RecipeDtoErrors.MAX_LENGTH_TITLE.en })
	@MinLength(1, { message: RecipeDtoErrors.MAX_LENGTH_TITLE.en })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.en })
	title: string;

	@ApiProperty({ minLength: 100, maxLength: 500 })
	@MaxLength(500, { message: RecipeDtoErrors.MAX_LENGTH_DESCRIPTION.en })
	@MaxLength(100, { message: RecipeDtoErrors.MIN_LENGTH_DESCRIPTION.en })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.en })
	@IsOptional()
	description?: string;

	@ApiProperty({ description: 'URL на фото' })
	@IsUrl({}, { message: CommonDtoErrors.IS_NOT_URL.en })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.en })
	image: string;

	@ApiProperty({ description: 'URL на видео (необязательно)' })
	@IsUrl({}, { message: CommonDtoErrors.IS_NOT_URL.en })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.en })
	@IsOptional()
	video?: string;

	@ApiProperty({ description: 'Время приготовления в минутах (необязательно)' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT.en })
	@IsOptional()
	cookingTime?: number;

	@ApiProperty({ enum: DifficultyEnum, default: null, description: 'Сложность (необязательно)' })
	@IsEnum(DifficultyEnum, { message: RecipeDtoErrors.INCORRECT_DIFFICULT.en })
	@IsOptional()
	difficulty?: DifficultyEnum;

	@ApiProperty({ minimum: 0, description: 'Белка в 100г' })
	@IsNumber({}, { message: CommonDtoErrors.IS_NOT_NUMBER.en })
	@Min(0, { message: CommonDtoErrors.MIN_ZERO.en })
	protein: number;

	@ApiProperty({ minimum: 0, description: 'Жиров в 100г' })
	@IsNumber({}, { message: CommonDtoErrors.IS_NOT_NUMBER.en })
	@Min(0, { message: CommonDtoErrors.MIN_ZERO.en })
	fat: number;

	@ApiProperty({ minimum: 0, description: 'Углеводов в 100г' })
	@IsNumber({}, { message: CommonDtoErrors.IS_NOT_NUMBER.en })
	@Min(0, { message: CommonDtoErrors.MIN_ZERO.en })
	carbs: number;

	@ApiProperty({ description: 'Id категории (необязательно)' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT.en })
	@IsOptional()
	categoryId?: number;

	@ApiProperty({ description: 'Id вида диеты (необязательно)' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT.en })
	@IsOptional()
	dietsTypeId?: number;

	@ApiProperty({ description: 'Id способа приготовления (необязательно)' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT.en })
	@IsOptional()
	preparationId?: number;
}
