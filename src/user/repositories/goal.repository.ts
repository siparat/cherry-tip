import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GoalModel } from '@prisma/client';

@Injectable()
export class GoalRepository {
	constructor(private database: DatabaseService) {}

	createGoal(goalModel: GoalModel): Promise<GoalModel> {
		return this.database.goalModel.create({ data: goalModel });
	}

	updateGoal(userId: string, goalModel: GoalModel): Promise<GoalModel> {
		return this.database.goalModel.update({ where: { userId }, data: goalModel });
	}

	findByUserId(userId: string): Promise<GoalModel | null> {
		return this.database.goalModel.findUnique({ where: { userId } });
	}
}
