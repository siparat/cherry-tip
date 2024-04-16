import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { UserDtoErrors } from '../user.constants';

export class CreateUserUnitsDto {
	@Max(300, { message: UserDtoErrors.INVALID_WEIGHT })
	@Min(0, { message: UserDtoErrors.INVALID_WEIGHT })
	@IsInt({ message: UserDtoErrors.IS_NOT_INT })
	weight: number;

	@Max(250, { message: UserDtoErrors.INVALID_HEIGHT })
	@Min(0, { message: UserDtoErrors.INVALID_HEIGHT })
	@IsInt({ message: UserDtoErrors.IS_NOT_INT })
	height: number;

	@Max(300, { message: UserDtoErrors.INVALID_BLOOD_GLUCOSE })
	@Min(0, { message: UserDtoErrors.INVALID_BLOOD_GLUCOSE })
	@IsInt({ message: UserDtoErrors.IS_NOT_INT })
	@IsOptional()
	bloodGlucose: number | null;
}
