import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryEnum, DayRecipesModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { DayEntity } from '../entities/day.entity';
import { CalendarErrorMessages } from '../calendar.constants';
import { IDay } from '../calendar.interfaces';

export const getNutrionsFromDayRecipes = () =>
	({
		recipes: {
			include: { recipes: { select: { id: true, calories: true, protein: true, fat: true, carbs: true } } }
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
				recipes: {
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
		date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		return this.database.dayModel.findFirst({
			where: { userId, date },
			include: getNutrionsFromDayRecipes()
		});
	}

	getDayRecipeByDate(date: Date, category: CategoryEnum): Promise<DayRecipesModel | null> {
		date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		return this.database.dayRecipesModel.findFirst({ where: { category, day: { date } } });
	}

	async setRecipes(dayRecipesId: number, recipesId: number[]): Promise<DayRecipesModel> {
		try {
			return await this.database.dayRecipesModel.update({
				where: { id: dayRecipesId },
				data: { recipes: { connect: recipesId.map((id) => ({ id })) } },
				include: { recipes: true }
			});
		} catch (error) {
			throw new BadRequestException(CalendarErrorMessages.RECIPE_NOT_FOUND);
		}
	}
}
