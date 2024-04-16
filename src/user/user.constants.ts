import { SexEnum } from '@prisma/client';

export const UserErrorMessages = {
	NOT_FOUND: 'Пользователь с таким id не найден',
	PROFILE_ALREADY_EXIST: 'Профиль уже создан',
	UNITS_MODEL_ALREADY_EXIST: 'Таблица характеристик уже создана'
};

export const UserDtoErrors = {
	MAX_DATE_BIRTH: 'Указан невалидный возраст',
	MIN_DATE_BIRTH: 'Минимальная дата рождения – 01-01-1900',

	MAX_LENGTH_NAME: 'Максимальная длина имени – 20',
	MAX_LENGTH_CITYNAME: 'Максимальная длина названия города – 20',

	IS_NOT_DATE: 'Указана не дата',
	IS_NOT_STRING: 'Указана не строка',
	IS_NOT_INT: 'Указано не целое число',

	INVALID_WEIGHT: 'Укажите настоящий вес',
	INVALID_HEIGHT: 'Укажите настоящий рост',
	INVALID_BLOOD_GLUCOSE: 'Укажите настоящее кол-во сахара в крови',

	INVALID_SEX: `Указан не валидный пол, выберите ${Object.keys(SexEnum).join(' или ')}`
};
