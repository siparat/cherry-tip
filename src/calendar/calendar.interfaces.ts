import { DayModel, DayRecipesModel } from '@prisma/client';
import { IRecipeOnlyNutrion } from 'src/recipe/recipe.interfaces';
import { UserEntity } from 'src/user/entities/user.entity';
import { PartialFields } from 'types/partial-fields.type';

export type IDay = DayModel & { recipes: (DayRecipesModel & { recipes: IRecipeOnlyNutrion[] })[] };

export type IDayEntity =
	| (Omit<
			PartialFields<
				DayModel,
				'id' | 'protein' | 'carbs' | 'fat' | 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'needCalories'
			>,
			'userId' | 'goal'
	  > & {
			user: UserEntity;
	  })
	| DayModel;

export type IDayRecipesEntity = PartialFields<DayRecipesModel, 'id'> & { recipesId: number[] };
