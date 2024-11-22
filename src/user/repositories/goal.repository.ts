import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GoalModel, Prisma } from '@prisma/client';
import { GoalEntity } from '../entities/goal.entity';

@Injectable()
export class GoalRepository {
	constructor(private database: DatabaseService) {}

	async createGoal(goalEntity: GoalEntity): Promise<GoalModel> {
		const { type, activity, calorieGoal, userId } = goalEntity;
		const sql = Prisma.sql`
			INSERT INTO "GoalModel"("type", "activity", "calorieGoal", "userId") VALUES (
				${Prisma.sql`${type}::"GoalTypeEnum"`},
				${Prisma.sql`${activity}::"ActivityEnum"`},
				${calorieGoal},
				${userId}
			)
			RETURNING *
		`;
		const [goal] = await this.database.$queryRaw<GoalModel[]>(sql);
		return goal;
	}

	async updateGoal(userId: string, goalEntity: GoalEntity): Promise<GoalModel> {
		const sql = Prisma.sql`
			UPDATE "GoalModel"
			SET
				"type" = ${Prisma.sql`${goalEntity.type}::"GoalTypeEnum"`},
				"activity" = ${Prisma.sql`${goalEntity.activity}::"ActivityEnum"`},
				"calorieGoal" = ${goalEntity.calorieGoal},
				"userId" = ${goalEntity.userId}
			WHERE "userId" = ${userId}
			RETURNING *
		`;
		const [goal] = await this.database.$queryRaw<GoalModel[]>(sql);
		return goal;
	}

	async findByUserId(userId: string): Promise<GoalModel | null> {
		const sql = Prisma.sql`
			SELECT * FROM "GoalModel"
			WHERE 
				"userId" = ${userId}
			LIMIT 1
		`;
		const [goal] = await this.database.$queryRaw<GoalModel[]>(sql);
		return goal || null;
	}
}
