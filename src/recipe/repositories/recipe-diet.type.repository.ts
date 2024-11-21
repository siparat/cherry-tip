import { Injectable } from '@nestjs/common';
import { DietTypeModel, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RecipeDietTypeRepository {
	constructor(private database: DatabaseService) {}

	async findById(id: number): Promise<DietTypeModel | null> {
		const sql = Prisma.sql`
			SELECT * FROM "DietTypeModel"
			WHERE id = ${id}
		`;
		const [dietType] = await this.database.$queryRaw<DietTypeModel[]>(sql);
		return dietType || null;
	}

	findAll(): Promise<DietTypeModel[]> {
		const sql = Prisma.sql`SELECT * FROM "DietTypeModel"`;
		return this.database.$queryRaw(sql);
	}
}
