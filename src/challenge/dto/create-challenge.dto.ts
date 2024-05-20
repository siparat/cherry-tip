import { DifficultyEnum } from '@prisma/client';
import { IsArray, IsEnum, IsHexColor, IsInt, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { CommonDtoErrors } from 'src/common/common.constants';
import { ChallengeDtoErrors } from '../challenge.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChallengeDto {
	@ApiProperty({ minLength: 1, maxLength: 24 })
	@MaxLength(24, { message: ChallengeDtoErrors.MAX_LENGTH_TITLE })
	@MinLength(1, { message: ChallengeDtoErrors.MIN_LENGTH_TITLE })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	title: string;

	@ApiProperty({ maxLength: 24 })
	@MaxLength(500, { message: ChallengeDtoErrors.MAX_LENGTH_DESCRIPTION })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	description: string;

	@ApiProperty({ description: 'URL на фото' })
	@IsUrl({}, { message: CommonDtoErrors.IS_NOT_URL })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	image: string;

	@ApiProperty({ description: 'Цвет в формате Hex' })
	@IsHexColor({ message: CommonDtoErrors.IS_NOT_HEX })
	color: string;

	@ApiProperty({ description: 'Длительность челленджа в днях' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT })
	durationDays: number;

	@ApiProperty({ enum: DifficultyEnum, default: DifficultyEnum.Easy, description: 'Сложность (необязательно)' })
	@IsEnum(DifficultyEnum, { message: ChallengeDtoErrors.INCORRECT_DIFFICULT })
	@IsOptional()
	difficulty?: DifficultyEnum;

	@ApiProperty({
		isArray: true,
		type: String,
		description: 'Массив строк, представляющие собой советы для успешного завершения челленжа'
	})
	@IsArray({ message: CommonDtoErrors.IS_NOT_ARRAY })
	@IsString({ each: true, message: CommonDtoErrors.IS_NOT_STRING })
	tips: string[];
}
