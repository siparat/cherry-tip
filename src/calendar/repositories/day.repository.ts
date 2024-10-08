import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryEnum, DayMealModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { DayEntity } from '../entities/day.entity';
import { CalendarErrorMessages } from '../calendar.constants';
import { IDay } from '../calendar.interfaces';
import { resetDateTime } from 'src/helpers/date.helpers';

export const getNutrionsFromDayRecipes = () =>
	({
		meals: {
			include: {
				recipes: {
					select: {
						recipe: { select: { id: true, protein: true, fat: true, carbs: true, calories: true } }
					}
				}
			}
		}
	}) as const;

@Injectable()
export class DayRepository {
	constructor(private database: DatabaseService) {}

	getById(id: number): Promise<IDay | null> {
		return this.database.dayModel.findUnique({
			where: { id },
			include: getNutrionsFromDayRecipes()
		});
	}

	async create(entity: DayEntity): Promise<IDay> {
		return this.database.dayModel.create({
			data: {
				...entity,
				meals: {
					createMany: {
						data: [
							{ category: CategoryEnum.Breakfast },
							{ category: CategoryEnum.Lunch },
							{ category: CategoryEnum.Dinner },
							{ category: CategoryEnum.Snack }
						]
					}
				}
			},
			include: getNutrionsFromDayRecipes()
		});
	}

	getByDate(date: Date, userId: string): Promise<IDay | null> {
		date = resetDateTime(date);
		return this.database.dayModel.findFirst({
			where: { userId, date },
			include: getNutrionsFromDayRecipes()
		});
	}

	getDayMealByDate(date: Date, category: CategoryEnum): Promise<DayMealModel | null> {
		date = resetDateTime(date);
		return this.database.dayMealModel.findFirst({ where: { category, day: { date } } });
	}

	async createDayRecipe(dayMealId: number, recipeId: number): Promise<number | null> {
		try {
			const { id } = await this.database.dayMealModelToRecipeModel.create({ data: { dayMealId, recipeId } });
			return id;
		} catch (error) {
			return null;
		}
	}

	async setRecipes(dayMealId: number, recipesId: number[]): Promise<DayMealModel> {
		const createdDayRecipesId: { id: number }[] = [];

		for (const id of recipesId) {
			const resultId = await this.createDayRecipe(dayMealId, id);
			if (!resultId) {
				continue;
			}
			createdDayRecipesId.push({ id: resultId });
		}

		try {
			return await this.database.dayMealModel.findUniqueOrThrow({
				where: { id: dayMealId },
				include: { recipes: { select: { recipe: true } } }
			});
		} catch (error) {
			throw new NotFoundException(CalendarErrorMessages.RECIPE_NOT_FOUND);
		}
	}
}
