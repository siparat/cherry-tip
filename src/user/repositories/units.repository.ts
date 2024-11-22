import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UnitsEntity } from '../entities/units.entity';
import { Prisma, UnitsModel } from '@prisma/client';

@Injectable()
export class UnitsRepository {
	constructor(private database: DatabaseService) {}

	async createUnitsModel(unitsEntity: UnitsEntity): Promise<UnitsModel> {
		const { weight, height, bloodGlucose, userId, targetWeight } = unitsEntity;
		const sql = Prisma.sql`
			INSERT INTO "UnitsModel"("weight", "height", "bloodGlucose", "userId", "targetWeight") VALUES (
				${weight},
				${height},
				${bloodGlucose || null},
				${userId},
				${targetWeight || null}
			)
			RETURNING *
		`;
		const [units] = await this.database.$queryRaw<UnitsModel[]>(sql);
		return units;
	}

	async updateUnitsModel(userId: string, unitsEntity: UnitsEntity): Promise<UnitsModel> {
		const sql = Prisma.sql`
			UPDATE "UnitsModel"
			SET
				"weight" = ${unitsEntity.weight},
				"height" = ${unitsEntity.height},
				"bloodGlucose" = ${unitsEntity.bloodGlucose},
				"userId" = ${unitsEntity.userId},
				"targetWeight" = ${unitsEntity.targetWeight}
			WHERE "userId" = ${userId}
			RETURNING *
		`;
		const [profile] = await this.database.$queryRaw<UnitsModel[]>(sql);
		return profile;
	}

	async findByUserId(userId: string): Promise<UnitsModel | null> {
		const sql = Prisma.sql`
			SELECT * FROM "UnitsModel"
			WHERE 
				"userId" = ${userId}
			LIMIT 1
		`;
		const [units] = await this.database.$queryRaw<UnitsModel[]>(sql);
		return units || null;
	}
}
