import { DayModel, DayRecipesModel } from '@prisma/client';
import { UserEntity } from 'src/user/entities/user.entity';
import { PartialFields } from 'types/partial-fields.type';

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
