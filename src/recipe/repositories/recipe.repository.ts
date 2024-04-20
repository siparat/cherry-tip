import { Injectable } from '@nestjs/common';
import { RecipeModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { RecipeEntity } from '../entities/recipe.entity';

@Injectable()
export class RecipeRepository {
	constructor(private database: DatabaseService) {}

	createRecipe(recipeEntity: RecipeEntity): Promise<RecipeModel> {
		return this.database.recipeModel.create({ data: recipeEntity });
	}

	findById(id: number): Promise<RecipeModel | null> {
		return this.database.recipeModel.findUnique({ where: { id } });
	}

	findByTitle(title: string): Promise<RecipeModel | null> {
		return this.database.recipeModel.findFirst({ where: { title } });
	}

	editRecipe(id: number, recipeEntity: RecipeEntity): Promise<RecipeModel> {
		return this.database.recipeModel.update({ where: { id }, data: recipeEntity });
	}

	editRecipeById(id: number): Promise<RecipeModel> {
		return this.database.recipeModel.delete({ where: { id } });
	}
}
