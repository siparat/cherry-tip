import { Injectable } from '@nestjs/common';
import { Prisma, RecipeModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { RecipeEntity } from '../entities/recipe.entity';
import { IPaginationParams } from 'src/common/common.interfaces';
import { IRecipeTags } from '../recipe.interfaces';

@Injectable()
export class RecipeRepository {
	constructor(private database: DatabaseService) {}

	search(
		q: string,
		options: IPaginationParams,
		tags?: IRecipeTags,
		allowPersonalRecipes?: boolean
	): Promise<RecipeModel[]> {
		const sql = Prisma.sql`
			SELECT * FROM "RecipeModel"
			WHERE
				("title" ILIKE ${'%' + `${q || ''}` + '%'} OR word_similarity(${q}, title) > 0.3)
				${!allowPersonalRecipes ? Prisma.sql`AND "userId" IS NULL` : Prisma.sql``}

				${tags?.categoryId ? Prisma.sql`AND "categoryId" = ${tags.categoryId}` : Prisma.sql``}
				${tags?.dietsTypeId ? Prisma.sql`AND "dietsTypeId" = ${tags.dietsTypeId}` : Prisma.sql``}
				${tags?.preparationId ? Prisma.sql`AND "preparationId" = ${tags.preparationId}` : Prisma.sql``}
			LIMIT ${options.take || null} 
			OFFSET ${options.skip || 0}
		`;
		return this.database.$queryRaw(sql);
	}

	findMineRecipes(userId: string, options: IPaginationParams, q?: string): Promise<RecipeModel[]> {
		return this.database.recipeModel.findMany({
			...options,
			where: { userId, title: { mode: 'insensitive', contains: q } }
		});
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

	deleteRecipeById(id: number): Promise<RecipeModel> {
		return this.database.recipeModel.delete({ where: { id } });
	}
}
