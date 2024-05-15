import { CategoryEnum } from '@prisma/client';
import { IDayRecipesEntity } from '../calendar.interfaces';

export class DayRecipesEntity {
	id?: number;
	recipesId: number[];
	category: CategoryEnum;
	dayId: number;

	constructor(dayRecipes: IDayRecipesEntity) {
		this.id = dayRecipes.id;
		this.recipesId = dayRecipes.recipesId;
		this.category = dayRecipes.category;
		this.dayId = dayRecipes.dayId;
	}
}
