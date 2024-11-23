import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryEnum, DayMealModel, DayMealModelToRecipeModel, DayModel, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { DayEntity } from '../entities/day.entity';
import { CalendarErrorMessages } from '../calendar.constants';
import { IDay } from '../calendar.interfaces';
import { resetDateTime } from 'src/helpers/date.helpers';

const includeMeals = (): Prisma.Sql =>
	Prisma.sql`
		(
			SELECT json_agg(m)
			FROM (
				SELECT 
					m.*, 
					(
						SELECT COALESCE(json_agg(r), '[]'::json)
						FROM (
							SELECT 
								r.id, 
								r.title, 
								r.image, 
								r.protein, 
								r.fat, 
								r.carbs, 
								r.calories
							FROM "DayMealModelToRecipeModel" dr
							JOIN "RecipeModel" r ON dr."recipeId" = r.id
							WHERE dr."dayMealId" = m.id
						) r
					) AS recipes
				FROM "DayMealModel" m
				WHERE m."dayId" = d.id
			) m
		) AS meals
	`;

@Injectable()
export class DayRepository {
	constructor(private database: DatabaseService) {}

	async getById(id: number): Promise<IDay | null> {
		const sql = Prisma.sql`
			SELECT 
				d.*,
				${includeMeals()}
			FROM "DayModel" d
			WHERE d.id = ${id}
		`;
		const result = await this.database.$queryRaw<IDay[]>(sql);
		return result[0] || null;
	}

	async create(entity: DayEntity): Promise<IDay> {
		const sql = Prisma.sql`
			INSERT INTO "DayModel"("goal", "date", "needCalories", "protein", "carbs", "fat", "breakfast", "lunch", "dinner", "snack", "userId") VALUES (
				${Prisma.sql`${entity.goal}::"GoalTypeEnum"`},
				${entity.date},
				${entity.needCalories},
				${entity.protein},
				${entity.carbs},
				${entity.fat},
				${entity.breakfast},
				${entity.lunch},
				${entity.dinner},
				${entity.snack},
				${entity.userId}
			)
			RETURNING *
		`;

		const [{ id }] = await this.database.$queryRaw<DayModel[]>(sql);

		const sqlMeals = Prisma.sql`
			INSERT INTO "DayMealModel"("dayId", "category") VALUES
			(${id}, ${Prisma.sql`${CategoryEnum.Breakfast}::"CategoryEnum"`}),
			(${id}, ${Prisma.sql`${CategoryEnum.Dinner}::"CategoryEnum"`}),
			(${id}, ${Prisma.sql`${CategoryEnum.Lunch}::"CategoryEnum"`}),
			(${id}, ${Prisma.sql`${CategoryEnum.Snack}::"CategoryEnum"`})
		`;
		await this.database.$queryRaw(sqlMeals);

		return this.getById(id) as Promise<IDay>;
	}

	async getByDate(date: Date, userId: string): Promise<IDay | null> {
		const sql = Prisma.sql`
			SELECT 
				d.*,
				${includeMeals()}
			FROM "DayModel" d
			WHERE d.date = ${resetDateTime(date)} AND "userId" = ${userId}
			LIMIT 1
		`;
		const result = await this.database.$queryRaw<IDay[]>(sql);
		return result[0] || null;
	}

	async getMealByDate(date: Date, category: CategoryEnum, userId: string): Promise<IDay['meals'][number] | null> {
		const sql = Prisma.sql`
			SELECT 
				m.*,
				(
					SELECT COALESCE(json_agg(r), '[]'::json)
					FROM (
						SELECT 
							r.id, 
							r.title, 
							r.image, 
							r.protein, 
							r.fat, 
							r.carbs, 
							r.calories
						FROM "DayMealModelToRecipeModel" dr
						JOIN "RecipeModel" r ON dr."recipeId" = r.id
						WHERE dr."dayMealId" = m.id
					) r
				) AS recipes
			FROM "DayMealModel" m
			LEFT JOIN "DayModel" d ON d.id = m."dayId"
			WHERE m.category = ${Prisma.sql`${category}::"CategoryEnum"`} AND d."userId" = ${userId} AND d.date = ${resetDateTime(date)}
			LIMIT 1
		`;
		const [meal] = await this.database.$queryRaw<IDay['meals'][number][]>(sql);
		return meal || null;
	}

	async createDayRecipe(dayMealId: number, recipeId: number): Promise<number | null> {
		try {
			const sql = Prisma.sql`INSERT INTO "DayMealModelToRecipeModel"("dayMealId", "recipeId") VALUES (${dayMealId}, ${recipeId})`;
			const [mealRecipe] = await this.database.$queryRaw<DayMealModelToRecipeModel[]>(sql);
			return mealRecipe.id;
		} catch (error) {
			return null;
		}
	}

	async setRecipes(dayMealId: number, recipesId: number[]): Promise<DayMealModel> {
		const createdDayRecipesId: { id: number }[] = [];

		const deleteManySql = Prisma.sql`
			DELETE FROM "DayMealModelToRecipeModel"
			WHERE "dayMealId" = ${dayMealId}
		`;
		await this.database.$queryRaw(deleteManySql);

		for (const id of recipesId) {
			const resultId = await this.createDayRecipe(dayMealId, id);
			if (!resultId) {
				continue;
			}
			createdDayRecipesId.push({ id: resultId });
		}

		const sql = Prisma.sql`
			SELECT 
				m.*, 
				(
					SELECT json_agg(r)
					FROM (
						SELECT dm.id, (
							SELECT json_agg(recipem) FROM "RecipeModel" recipem
							WHERE id = dm."recipeId"
						) as recipe 
						FROM "DayMealModelToRecipeModel" dm
						WHERE dm."dayMealId" = m.id
					) r
				) AS recipes
			FROM "DayMealModel" m
			WHERE id = ${dayMealId}
		`;
		const [dayMeal] = await this.database.$queryRaw<DayMealModel[]>(sql);
		if (!dayMeal) {
			throw new NotFoundException(CalendarErrorMessages.RECIPE_NOT_FOUND);
		}
		return dayMeal;
	}
}
