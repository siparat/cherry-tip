import { Injectable } from '@nestjs/common';
import { PreparationModel, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RecipePreparationRepository {
	constructor(private database: DatabaseService) {}

	async findById(id: number): Promise<PreparationModel | null> {
		const sql = Prisma.sql`
			SELECT * FROM "PreparationModel"
			WHERE id = ${id}
		`;
		const [preparation] = await this.database.$queryRaw<PreparationModel[]>(sql);
		return preparation || null;
	}

	findAll(): Promise<PreparationModel[]> {
		const sql = Prisma.sql`SELECT * FROM "PreparationModel"`;
		return this.database.$queryRaw(sql);
	}
}
