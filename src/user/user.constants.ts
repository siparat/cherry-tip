import { SexEnum } from '@prisma/client';

export const UserErrorMessages = {
	NOT_FOUND: 'Пользователь с таким id не найден',
	PROFILE_ALREADY_EXIST: 'Профиль уже создан',
	UNITS_MODEL_ALREADY_EXIST: 'Таблица характеристик уже создана',
	GOAL_ALREADY_EXIST: 'Цель уже создана',
	FORBIDDEN_ROLE: 'Ваша роль не позволяет выполнять данную операцию',
	ID_IS_MISSING_IN_ENTITY: 'В UserEntity отсутствует id',
	IMPOSSIBLE_CALCULATE: 'Невозможно высчитать цель по калорийности',
	UNITS_IS_REQUIRED: 'Заполните сначала рост и вес',
	GOAL_IS_REQUIRED: 'Введите все данные при регистрации',
	PROFILE_IS_REQUIRED: 'Сначала создайте профиль'
};

export const UserDtoErrors = {
	MAX_DATE_BIRTH: 'Указан невалидный возраст',
	MIN_DATE_BIRTH: 'Минимальная дата рождения – 01-01-1900',

	MAX_LENGTH_NAME: 'Максимальная длина имени – 20',
	MAX_LENGTH_CITYNAME: 'Максимальная длина названия города – 20',

	INVALID_WEIGHT: 'Укажите настоящий вес',
	INVALID_HEIGHT: 'Укажите настоящий рост',
	INVALID_BLOOD_GLUCOSE: 'Укажите настоящее кол-во сахара в крови',

	INVALID_GOAL_ACTIVITY: 'Укажите валидную активность',
	INVALID_GOAL_TYPE: 'Указана не валидная цель',

	INVALID_SEX: `Указан не валидный пол, выберите ${Object.keys(SexEnum).join(' или ')}`
};
