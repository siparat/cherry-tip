import { CategoryEnum } from '@prisma/client';
import { IDayMealEntity } from '../calendar.interfaces';

export class DayMealEntity {
	id?: number;
	recipesId: number[];
	category: CategoryEnum;
	dayId: number;

	constructor(dayMeal: IDayMealEntity) {
		this.id = dayMeal.id;
		this.recipesId = dayMeal.recipesId;
		this.category = dayMeal.category;
		this.dayId = dayMeal.dayId;
	}
}
