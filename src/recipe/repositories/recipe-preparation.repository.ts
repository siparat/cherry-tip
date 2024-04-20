import { Injectable } from '@nestjs/common';
import { PreparationModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RecipePreparationRepository {
	constructor(private database: DatabaseService) {}

	findById(id: number): Promise<PreparationModel | null> {
		return this.database.preparationModel.findUnique({ where: { id } });
	}
}
