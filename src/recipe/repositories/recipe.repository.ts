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
				("title" ILIKE ${'%' + `${q || ''}` + '%'} OR similarity(${q}, title) > 0.3)
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
		const sql = Prisma.sql`
			SELECT * FROM "RecipeModel" 
			WHERE 
				"userId" = ${userId} AND 
				"title" ILIKE ${'%' + (q || '') + '%'}
			LIMIT ${options.take || null} 
			OFFSET ${options.skip || 0}
		`;
		return this.database.$queryRaw(sql);
	}

	async createRecipe(recipeEntity: RecipeEntity): Promise<RecipeModel> {
		const sql = Prisma.sql`
			INSERT INTO "RecipeModel"("updatedAt", "title", "description", "image", "video", "calories", "cookingTime", "difficulty", "protein", "fat", "carbs", "categoryId", "dietsTypeId", "preparationId", "userId") VALUES (
				now(),
				${recipeEntity.title},
				${recipeEntity.description || null},
				${recipeEntity.image},
				${recipeEntity.video || null},
				${recipeEntity.calories},
				${recipeEntity.cookingTime || null},
				${Prisma.sql`${recipeEntity.difficulty}::"DifficultyEnum"` || null},
				${recipeEntity.protein},
				${recipeEntity.fat},
				${recipeEntity.carbs},
				${recipeEntity.categoryId || null},
				${recipeEntity.dietsTypeId || null},
				${recipeEntity.preparationId || null},
				${recipeEntity.userId || null}
			)
			RETURNING *
		`;
		const [recipe] = await this.database.$queryRaw<RecipeModel[]>(sql);
		return recipe || null;
	}

	async findById(id: number): Promise<RecipeModel | null> {
		const sql = Prisma.sql`
			SELECT * FROM "RecipeModel"
			WHERE id = ${id}
		`;
		const [recipe] = await this.database.$queryRaw<RecipeModel[]>(sql);
		return recipe || null;
	}

	async findByTitle(title: string): Promise<RecipeModel | null> {
		const sql = Prisma.sql`
			SELECT * FROM "RecipeModel"
			WHERE title = ${title}
		`;
		const [recipe] = await this.database.$queryRaw<RecipeModel[]>(sql);
		return recipe || null;
	}

	async editRecipe(id: number, recipeEntity: RecipeEntity): Promise<RecipeModel> {
		const sql = Prisma.sql`
			UPDATE "RecipeModel"
			SET
				"updatedAt" = now(),
				"title" = ${recipeEntity.title},
				"description" = ${recipeEntity.description || null},
				"image" = ${recipeEntity.image},
				"video" = ${recipeEntity.video || null},
				"calories" = ${recipeEntity.calories},
				"cookingTime" = ${recipeEntity.cookingTime || null},
				"difficulty" = ${Prisma.sql`${recipeEntity.difficulty}::"DifficultyEnum"` || null},
				"protein" = ${recipeEntity.protein},
				"fat" = ${recipeEntity.fat},
				"carbs" = ${recipeEntity.carbs},
				"categoryId" = ${recipeEntity.categoryId || null},
				"dietsTypeId" = ${recipeEntity.dietsTypeId || null},
				"preparationId" = ${recipeEntity.preparationId || null},
				"userId" = ${recipeEntity.userId || null}
			WHERE id = ${id}
			RETURNING *
		`;
		const [recipe] = await this.database.$queryRaw<RecipeModel[]>(sql);
		return recipe;
	}

	async deleteRecipeById(id: number): Promise<RecipeModel> {
		const sql = Prisma.sql`
			DELETE FROM "RecipeModel"
			WHERE id = ${id}
			RETURNING *
		`;
		const [recipe] = await this.database.$queryRaw<RecipeModel[]>(sql);
		return recipe;
	}
}
