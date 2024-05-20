import { Injectable } from '@nestjs/common';
import { CategoryModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RecipeCategoryRepository {
	constructor(private database: DatabaseService) {}

	findById(id: number): Promise<CategoryModel | null> {
		return this.database.categoryModel.findUnique({ where: { id } });
	}

	findAll(): Promise<CategoryModel[]> {
		return this.database.categoryModel.findMany();
	}
}
