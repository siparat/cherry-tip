import { Injectable } from '@nestjs/common';
import { CategoryModel, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RecipeCategoryRepository {
	constructor(private database: DatabaseService) {}

	async findById(id: number): Promise<CategoryModel | null> {
		const sql = Prisma.sql`
			SELECT * FROM "CategoryModel"
			WHERE id = ${id}
		`;
		const [category] = await this.database.$queryRaw<CategoryModel[]>(sql);
		return category || null;
	}

	findAll(): Promise<CategoryModel[]> {
		const sql = Prisma.sql`SELECT * FROM "CategoryModel"`;
		return this.database.$queryRaw(sql);
	}
}
