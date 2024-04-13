import { SexEnum } from '@prisma/client';

export const UserErrorMessages = {
	NOT_FOUND: 'Пользователь с таким id не найден',
	PROFILE_ALREADY_EXIST: 'Профиль уже создан'
};

export const UserDtoErrors = {
	MAX_DATE_BIRTH: 'Указан невалидный возраст',
	MIN_DATE_BIRTH: 'Минимальная дата рождения – 01-01-1900',

	MAX_LENGTH_NAME: 'Максимальная длина имени – 20',
	MAX_LENGTH_CITYNAME: 'Максимальная длина названия города – 20',

	IS_NOT_DATE: 'Указана не дата',
	IS_NOT_STRING: 'Указана не строка',

	INVALID_SEX: `Указан не валидный пол, выберите ${Object.keys(SexEnum).join(' или ')}`
};
