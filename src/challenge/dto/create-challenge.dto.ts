import { DifficultyEnum } from '@prisma/client';
import { IsArray, IsEnum, IsHexColor, IsInt, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { CommonDtoErrors } from 'src/common/common.constants';
import { ChallengeDtoErrors } from '../challenge.constants';

export class CreateChallengeDto {
	@MaxLength(24, { message: ChallengeDtoErrors.MAX_LENGTH_TITLE })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	title: string;

	@MaxLength(500, { message: ChallengeDtoErrors.MAX_LENGTH_DESCRIPTION })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	description: string;

	@IsUrl({}, { message: CommonDtoErrors.IS_NOT_URL })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	image: string;

	@IsHexColor({ message: CommonDtoErrors.IS_NOT_HEX })
	color: string;

	@IsInt({ message: CommonDtoErrors.IS_NOT_INT })
	durationDays: number;

	@IsEnum(DifficultyEnum, { message: ChallengeDtoErrors.INCORRECT_DIFFICULT })
	@IsOptional()
	difficulty?: DifficultyEnum;

	@IsArray({ message: CommonDtoErrors.IS_NOT_ARRAY })
	@IsString({ each: true, message: CommonDtoErrors.IS_NOT_STRING })
	tips: string[];
}
