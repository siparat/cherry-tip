import { DayModel, DayMealModel } from '@prisma/client';
import { IRecipeShortInfo } from 'src/recipe/recipe.interfaces';
import { UserEntity } from 'src/user/entities/user.entity';
import { PartialFields } from 'types/partial-fields.type';

export type IDay = DayModel & { meals: (DayMealModel & { recipes: { recipe: IRecipeShortInfo }[] })[] };

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

export type IDayMealEntity = PartialFields<DayMealModel, 'id'> & { recipesId: number[] };
