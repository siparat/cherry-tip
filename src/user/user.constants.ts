import { SexEnum } from '@prisma/client';
import { ErrorsType } from 'src/common/common.interfaces';

export const UserErrorMessages: ErrorsType = {
	NOT_FOUND: {
		ru: 'Пользователь с таким id не найден',
		en: 'The user with this ID was not found'
	},
	PROFILE_ALREADY_EXIST: {
		ru: 'Профиль уже создан',
		en: 'The profile has already been created'
	},
	UNITS_MODEL_ALREADY_EXIST: {
		ru: 'Таблица характеристик уже создана',
		en: 'The characteristics table has already been created'
	},
	GOAL_ALREADY_EXIST: {
		ru: 'Цель уже создана',
		en: 'The goal has already been created'
	},
	FORBIDDEN_ROLE: {
		ru: 'Ваша роль не позволяет выполнять данную операцию',
		en: 'Your role does not allow you to perform this operation'
	},
	ID_IS_MISSING_IN_ENTITY: {
		ru: 'В UserEntity отсутствует id',
		en: 'There is no ID in UserEntity'
	},
	IMPOSSIBLE_CALCULATE: {
		ru: 'Невозможно высчитать цель по калорийности',
		en: 'It is impossible to calculate the calorie target'
	},
	UNITS_IS_REQUIRED: {
		ru: 'Заполните сначала рост и вес',
		en: 'Fill in the height and weight first'
	},
	GOAL_IS_REQUIRED: {
		ru: 'Введите все данные при регистрации',
		en: 'Enter all the details during registration'
	},
	PROFILE_IS_REQUIRED: {
		ru: 'Сначала создайте профиль',
		en: 'First, create a profile'
	}
};

export const UserDtoErrors: ErrorsType = {
	MAX_DATE_BIRTH: {
		ru: 'Указан невалидный возраст',
		en: 'Invalid age is specified'
	},
	MIN_DATE_BIRTH: {
		ru: 'Минимальная дата рождения – 01-01-1900',
		en: 'The minimum date of birth is 01-01-1900'
	},
	MAX_LENGTH_NAME: {
		ru: 'Максимальная длина имени – 20',
		en: 'The maximum length of the name is 20'
	},
	MAX_LENGTH_CITYNAME: {
		ru: 'Максимальная длина названия города – 20',
		en: 'The maximum length of the city name is 20'
	},
	INVALID_WEIGHT: {
		ru: 'Укажите настоящий вес',
		en: 'Specify the actual weight'
	},
	INVALID_HEIGHT: {
		ru: 'Укажите настоящий рост',
		en: 'Indicate the real growth'
	},
	INVALID_BLOOD_GLUCOSE: {
		ru: 'Укажите настоящее кол-во сахара в крови',
		en: 'Specify the current amount of glucose in the blood'
	},
	INVALID_GOAL_ACTIVITY: {
		ru: 'Укажите валидную активность',
		en: 'Specify a valid activity'
	},
	INVALID_GOAL_TYPE: {
		ru: 'Указана не валидная цель',
		en: 'An invalid goal is specified'
	},
	INVALID_SEX: {
		ru: `Указан не валидный пол, выберите ${Object.keys(SexEnum).join(' или ')}`,
		en: `Invalid gender is specified, select ${Object.keys(SexEnum).join(' or ')}`
	}
};
