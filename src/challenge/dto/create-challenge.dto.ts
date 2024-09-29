import { DifficultyEnum } from '@prisma/client';
import {
	IsArray,
	IsEmpty,
	IsEnum,
	IsHexColor,
	IsInt,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength,
	MinLength
} from 'class-validator';
import { CommonDtoErrors } from 'src/common/common.constants';
import { ChallengeDtoErrors } from '../challenge.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChallengeDto {
	@IsEmpty()
	id: number;

	@IsEmpty()
	createdAt: Date;

	@IsEmpty()
	updatedAt: Date;

	@IsEmpty()
	userChallenge: unknown;

	@ApiProperty({ minLength: 1, maxLength: 24 })
	@MaxLength(24, { message: ChallengeDtoErrors.MAX_LENGTH_TITLE.en })
	@MinLength(1, { message: ChallengeDtoErrors.MIN_LENGTH_TITLE.en })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.en })
	title: string;

	@ApiProperty({ maxLength: 500 })
	@MaxLength(500, { message: ChallengeDtoErrors.MAX_LENGTH_DESCRIPTION.en })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.en })
	description: string;

	@ApiProperty({ description: 'URL на фото' })
	@IsUrl({}, { message: CommonDtoErrors.IS_NOT_URL.en })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING.en })
	image: string;

	@ApiProperty({ description: 'Цвет в формате Hex' })
	@IsHexColor({ message: CommonDtoErrors.IS_NOT_HEX.en })
	color: string;

	@ApiProperty({ description: 'Длительность челленджа в днях' })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT.en })
	durationDays: number;

	@ApiProperty({ enum: DifficultyEnum, default: DifficultyEnum.Easy, description: 'Сложность (необязательно)' })
	@IsEnum(DifficultyEnum, { message: ChallengeDtoErrors.INCORRECT_DIFFICULT.en })
	@IsOptional()
	difficulty?: DifficultyEnum;

	@ApiProperty({
		isArray: true,
		type: String,
		description: 'Массив строк, представляющие собой советы для успешного завершения челленжа'
	})
	@IsArray({ message: CommonDtoErrors.IS_NOT_ARRAY.en })
	@IsString({ each: true, message: CommonDtoErrors.IS_NOT_STRING.en })
	tips: string[];
}
