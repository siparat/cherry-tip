import { DifficultyEnum } from '@prisma/client';
import {
	IsEmpty,
	IsEnum,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	IsUrl,
	Matches,
	MaxLength,
	Min,
	MinLength
} from 'class-validator';
import { CommonDtoErrors } from 'src/common/common.constants';
import { RecipeDtoErrors } from '../recipe.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDto {
	@IsEmpty()
	id?: number;

	@IsEmpty()
	createdAt?: Date;

	@IsEmpty()
	updatedAt?: Date;

	@IsEmpty()
	userId?: string;

	@ApiProperty({ minLength: 1, maxLength: 40 })
	@MaxLength(40, { message: RecipeDtoErrors.MAX_LENGTH_TITLE.ru })
	@MinLength(1, { message: RecipeDtoErrors.MAX_LENGTH_TITLE.ru })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.ru })
	title: string;

	@ApiProperty({ minLength: 100, maxLength: 500 })
	@Matches(/^[^\{\}\[\]]*$/, { message: CommonDtoErrors.IS_NOT_STRING.ru })
	@MaxLength(500, { message: RecipeDtoErrors.MAX_LENGTH_DESCRIPTION.ru })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.ru })
	@IsOptional()
	description?: string;

	@ApiProperty({ description: 'URL на фото' })
	@IsUrl({}, { message: CommonDtoErrors.IS_NOT_URL.ru })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.ru })
	image: string;

	@ApiProperty({ description: 'URL на видео (необязательно)' })
	@IsUrl({}, { message: CommonDtoErrors.IS_NOT_URL.ru })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.ru })
	@IsOptional()
	video?: string;

	@ApiProperty({ description: 'Время приготовления в минутах (необязательно)' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT.ru })
	@IsOptional()
	cookingTime?: number;

	@ApiProperty({ enum: DifficultyEnum, default: null, description: 'Сложность (необязательно)' })
	@IsEnum(DifficultyEnum, { message: RecipeDtoErrors.INCORRECT_DIFFICULT.ru })
	@IsOptional()
	difficulty?: DifficultyEnum;

	@ApiProperty({ minimum: 0, description: 'Белка в 100г' })
	@IsNumber({}, { message: CommonDtoErrors.IS_NOT_NUMBER.ru })
	@Min(0, { message: CommonDtoErrors.MIN_ZERO.ru })
	protein: number;

	@ApiProperty({ minimum: 0, description: 'Жиров в 100г' })
	@IsNumber({}, { message: CommonDtoErrors.IS_NOT_NUMBER.ru })
	@Min(0, { message: CommonDtoErrors.MIN_ZERO.ru })
	fat: number;

	@ApiProperty({ minimum: 0, description: 'Углеводов в 100г' })
	@IsNumber({}, { message: CommonDtoErrors.IS_NOT_NUMBER.ru })
	@Min(0, { message: CommonDtoErrors.MIN_ZERO.ru })
	carbs: number;

	@ApiProperty({ description: 'Id категории (необязательно)' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT.ru })
	@IsOptional()
	categoryId?: number;

	@ApiProperty({ description: 'Id вида диеты (необязательно)' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT.ru })
	@IsOptional()
	dietsTypeId?: number;

	@ApiProperty({ description: 'Id способа приготовления (необязательно)' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT.ru })
	@IsOptional()
	preparationId?: number;
}
