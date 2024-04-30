import { ActivityEnum, GoalTypeEnum } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { UserDtoErrors } from '../user.constants';

export class CreateUserGoalDto {
	@IsEnum(ActivityEnum, { message: UserDtoErrors.INVALID_GOAL_ACTIVITY })
	activity: ActivityEnum;

	@IsEnum(GoalTypeEnum, { message: UserDtoErrors.INVALID_GOAL_TYPE })
	type: GoalTypeEnum;
}
