import { DifficultyEnum } from '@prisma/client';
import { IRecipeEntity } from '../recipe.interfaces';
import { NutrientValues, RecipeErrorMessages } from '../recipe.constants';
import { BadRequestException } from '@nestjs/common';

export class RecipeEntity {
	fat: number;
	protein: number;
	carbs: number;

	id?: number;
	title: string;
	description?: string;
	image: string;
	video?: string;
	userId?: string;
	cookingTime?: number;
	difficulty?: DifficultyEnum;
	calories: number;
	categoryId?: number;
	dietsTypeId?: number;
	preparationId?: number;

	constructor(recipe: IRecipeEntity) {
		this.id = recipe.id;
		this.title = recipe.title;
		this.description = recipe.description ?? undefined;
		this.image = recipe.image;
		this.video = recipe.video ?? undefined;
		this.cookingTime = recipe.cookingTime ?? undefined;
		this.difficulty = recipe.difficulty ?? undefined;
		this.protein = recipe.protein;
		this.fat = recipe.fat;
		this.carbs = recipe.carbs;
		this.categoryId = recipe.categoryId ?? undefined;
		this.dietsTypeId = recipe.dietsTypeId ?? undefined;
		this.preparationId = recipe.preparationId ?? undefined;
		this.calories = RecipeEntity.calculateCalories(this.protein, this.carbs, this.fat);
		if (this.calories > Math.pow(2, 31) - 1) {
			throw new BadRequestException(RecipeErrorMessages.CALORIES_LIMIT_EXCEEDED);
		}
		this.userId = recipe.userId ?? undefined;
	}

	static calculateCalories(protein: number, carbs: number, fat: number): number {
		return NutrientValues.PROTEIN * protein + NutrientValues.FAT * fat + NutrientValues.CARBS * carbs;
	}
}
