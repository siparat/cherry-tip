import { ActivityEnum, GoalTypeEnum } from '@prisma/client';
import { IGoalEntity } from '../user.interfaces';
import { UserErrorMessages } from '../user.constants';
import { UnprocessableEntityException } from '@nestjs/common';

export class GoalEntity {
	type: GoalTypeEnum;
	activity: ActivityEnum;
	calorieGoal: number;
	userId: string;

	constructor({ type, activity, user }: IGoalEntity) {
		if (!user.id) {
			throw new UnprocessableEntityException(UserErrorMessages.ID_IS_MISSING_IN_ENTITY);
		}

		this.type = type;
		this.activity = activity;
		this.userId = user.id;
		this.calorieGoal = user.setGoal(this).calculateGoalCalorie();
	}
}
