import { Injectable } from '@nestjs/common';
import { RecipeModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { RecipeEntity } from '../entities/recipe.entity';
import { IPaginationParams } from 'src/common/common.interfaces';
import { IRecipeTags } from '../recipe.interfaces';

@Injectable()
export class RecipeRepository {
	constructor(private database: DatabaseService) {}

	search(q: string, options: IPaginationParams, tags?: IRecipeTags): Promise<RecipeModel[]> {
		return this.database.recipeModel.findMany({
			...options,
			where: {
				title: { mode: 'insensitive', contains: q },
				categoryId: tags?.categoryId,
				preparationId: tags?.preparationId,
				dietsTypeId: tags?.dietsTypeId,
				userId: null
			}
		});
	}

	findMineRecipes(userId: string, options: IPaginationParams): Promise<RecipeModel[]> {
		return this.database.recipeModel.findMany({ ...options, where: { userId } });
	}

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
