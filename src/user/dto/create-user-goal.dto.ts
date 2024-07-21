import { ActivityEnum, GoalTypeEnum } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { UserDtoErrors } from '../user.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserGoalDto {
	@ApiProperty({ enum: ActivityEnum })
	@IsEnum(ActivityEnum, { message: UserDtoErrors.INVALID_GOAL_ACTIVITY.en })
	activity: ActivityEnum;

	@ApiProperty({ enum: GoalTypeEnum })
	@IsEnum(GoalTypeEnum, { message: UserDtoErrors.INVALID_GOAL_TYPE.en })
	type: GoalTypeEnum;
}
