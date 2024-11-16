import { CategoryModel, DietTypeModel, PreparationModel, RecipeModel } from '@prisma/client';
import { PartialFields } from 'types/partial-fields.type';

export type IRecipeEntity = Omit<
	PartialFields<
		RecipeModel,
		| 'id'
		| 'createdAt'
		| 'updatedAt'
		| 'description'
		| 'video'
		| 'cookingTime'
		| 'difficulty'
		| 'categoryId'
		| 'dietsTypeId'
		| 'preparationId'
		| 'userId'
	>,
	'calories' | 'protein' | 'fat' | 'carbs'
> & {
	protein: number;
	fat: number;
	carbs: number;
};

export type IRecipeTags = Partial<Pick<RecipeModel, 'categoryId' | 'preparationId' | 'dietsTypeId'>>;

export interface IRecipeTagModels {
	categories: CategoryModel[];
	preparations: PreparationModel[];
	diets: DietTypeModel[];
}

export type Nutrition = Pick<IRecipeEntity, 'protein' | 'carbs' | 'fat'>;

export type IRecipeShortInfo = Pick<RecipeModel, 'id' | 'title' | 'image' | 'calories' | 'protein' | 'carbs' | 'fat'>;
