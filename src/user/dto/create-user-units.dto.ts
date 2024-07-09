import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { UserDtoErrors } from '../user.constants';
import { CommonDtoErrors } from 'src/common/common.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserUnitsDto {
	@ApiProperty({ minimum: 0, maximum: 300 })
	@Max(300, { message: UserDtoErrors.INVALID_WEIGHT })
	@Min(0, { message: UserDtoErrors.INVALID_WEIGHT })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT })
	weight: number;

	@ApiProperty({ minimum: 0, maximum: 250 })
	@Max(250, { message: UserDtoErrors.INVALID_HEIGHT })
	@Min(0, { message: UserDtoErrors.INVALID_HEIGHT })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT })
	height: number;

	@ApiProperty({ minimum: 0, maximum: 300, type: Number, description: 'Уровень сахара в крови mmol/L (необязательно)' })
	@Max(300, { message: UserDtoErrors.INVALID_BLOOD_GLUCOSE })
	@Min(0, { message: UserDtoErrors.INVALID_BLOOD_GLUCOSE })
	@IsInt({ message: CommonDtoErrors.IS_NOT_INT })
	@IsOptional()
	bloodGlucose: number | null;

	@ApiProperty({ minimum: 0, maximum: 300 })
	@Max(300, { message: UserDtoErrors.INVALID_WEIGHT })
	@Min(0, { message: UserDtoErrors.INVALID_WEIGHT })
	@IsOptional()
	targetWeight: number | null;
}
