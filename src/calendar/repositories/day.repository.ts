import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryEnum, DayModel, DayRecipesModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { DayEntity } from '../entities/day.entity';
import { CalendarErrorMessages } from '../calendar.constants';

@Injectable()
export class DayRepository {
	constructor(private database: DatabaseService) {}

	getById(id: number): Promise<DayModel | null> {
		return this.database.dayModel.findUnique({
			where: { id },
			include: { recipes: { include: { recipes: true } } }
		});
	}

	async create(entity: DayEntity): Promise<DayModel> {
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
			include: { recipes: { include: { recipes: true } } }
		});
	}

	getByDate(date: Date, userId: string): Promise<DayModel | null> {
		date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		return this.database.dayModel.findFirst({
			where: { userId, date },
			include: { recipes: { include: { recipes: true } } }
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
