import { ErrorsType } from 'src/common/common.interfaces';

export const CalendarErrorMessages = {
	RECIPE_NOT_FOUND: {
		ru: 'Рецепт с таким id не найден',
		en: 'The recipe with this ID was not found'
	},
	DAY_NOT_FOUND: {
		ru: 'День с таким идентификатором не найден',
		en: 'The day with this ID was not found'
	},
	ANOTHER_DAY: {
		ru: 'Запрещено просматривать чужую статистику',
		en: "It is forbidden to view other people's statistics"
	},
	INVALID_DATE: {
		ru: 'Укажите существующий день',
		en: 'Specify an existing day'
	}
} satisfies ErrorsType;

export const CalendarDtoErrors = {
	INVALID_CATEGORY: {
		ru: 'Укажите категорию блюда',
		en: 'Specify the category of the dish'
	}
} satisfies ErrorsType;
