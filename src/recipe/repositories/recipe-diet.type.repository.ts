import { Injectable } from '@nestjs/common';
import { DietTypeModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RecipeDietTypeRepository {
	constructor(private database: DatabaseService) {}

	findById(id: number): Promise<DietTypeModel | null> {
		return this.database.dietTypeModel.findUnique({ where: { id } });
	}
}
