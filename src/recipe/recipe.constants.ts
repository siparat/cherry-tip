import { ErrorsType } from 'src/common/common.interfaces';

export const NutrientValues = {
	PROTEIN: 4,
	CARBS: 4,
	FAT: 9
};

export const RecipeErrorMessages: ErrorsType = {
	ALREADY_EXIST_WITH_THIS_NAME: {
		ru: 'Рецепт с таким названием уже есть, укажите другое название',
		en: 'There is already a recipe with this name, please specify another name'
	},
	NOT_FOUND: {
		ru: 'Рецепт с таким id не найден',
		en: 'The recipe with this ID was not found'
	},
	TAG_NOT_FOUND: {
		ru: 'Категория с таким id не найдена',
		en: 'The category with this ID was not found'
	},
	FORBIDDEN_VIEW_RECIPE: {
		ru: 'Запрещено просматривать чужой рецепт',
		en: "It is forbidden to view someone else's recipe"
	},
	FORBIDDEN_EDIT_RECIPE: {
		ru: 'Запрещено редактировать чужой рецепт',
		en: "It is forbidden to edit someone else's recipe"
	},
	FORBIDDEN_DELETE_RECIPE: {
		ru: 'Запрещено удалять чужой рецепт',
		en: "It is forbidden to delete someone else's recipe"
	}
};

export const RecipeDtoErrors: ErrorsType = {
	MAX_LENGTH_TITLE: {
		ru: 'Максимальная длина названия – 40',
		en: 'The maximum length of the name is 40'
	},
	MIN_LENGTH_TITLE: {
		ru: 'Минимальная длина названия – 40',
		en: 'The minimum length of the name is 40'
	},
	MAX_LENGTH_DESCRIPTION: {
		ru: 'Максимальная длина описания – 500',
		en: 'The maximum description length is 500'
	},
	MIN_LENGTH_DESCRIPTION: {
		ru: 'Минимальная длина описания – 100',
		en: 'The minimum description length is 100'
	},
	INCORRECT_DIFFICULT: {
		ru: 'Укажите верную сложность приготовления',
		en: 'Specify the correct cooking difficulty'
	}
};
