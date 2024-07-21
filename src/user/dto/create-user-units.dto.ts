import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { UserDtoErrors } from '../user.constants';
import { CommonDtoErrors } from 'src/common/common.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserUnitsDto {
	@ApiProperty({ minimum: 0, maximum: 300 })
	@Max(300, { message: UserDtoErrors.INVALID_WEIGHT.en })
	@Min(0, { message: UserDtoErrors.INVALID_WEIGHT.en })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT.en })
	weight: number;

	@ApiProperty({ minimum: 0, maximum: 250 })
	@Max(250, { message: UserDtoErrors.INVALID_HEIGHT.en })
	@Min(0, { message: UserDtoErrors.INVALID_HEIGHT.en })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT.en })
	height: number;

	@ApiProperty({ minimum: 0, maximum: 300, type: Number, description: 'Уровень сахара в крови mmol/L (необязательно)' })
	@Max(300, { message: UserDtoErrors.INVALID_BLOOD_GLUCOSE.en })
	@Min(0, { message: UserDtoErrors.INVALID_BLOOD_GLUCOSE.en })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT.en })
	@IsOptional()
	bloodGlucose: number | null;

	@ApiProperty({ minimum: 0, maximum: 300 })
	@Max(300, { message: UserDtoErrors.INVALID_WEIGHT.en })
	@Min(0, { message: UserDtoErrors.INVALID_WEIGHT.en })
	@IsOptional()
	targetWeight: number | null;
}
