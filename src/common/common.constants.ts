import { ErrorsType } from './common.interfaces';

export const CommonDtoErrors = {
	LATIN_ONLY: {
		ru: 'Разрешено использовать только латинские буквы и цифры',
		en: 'It is allowed to use only Latin letters and numbers'
	},
	INVALID_DATE: {
		ru: 'Укажите валидную дату',
		en: 'Specify a valid date'
	},
	INVALID_MIME_TYPE: {
		ru: 'Передан неверный тип файла',
		en: 'Invalid file type was passed'
	},
	IS_NOT_STRING: {
		ru: 'Указана не строка',
		en: 'Not a string is specified'
	},
	IS_NOT_EMAIL: {
		ru: 'Указана не почта',
		en: 'The email address is not specified'
	},
	IS_NOT_DATE: {
		ru: 'Указана не дата',
		en: 'The date is not specified'
	},
	IS_NOT_INT: {
		ru: 'Указано не целое число',
		en: 'The specified number is not an integer'
	},
	IS_NOT_NUMBER: {
		ru: 'Указано не число',
		en: 'The specified number is not'
	},
	IS_NOT_URL: {
		ru: 'Указана не ссылка',
		en: 'The link is url specified'
	},
	IS_NOT_HEX: {
		ru: 'Указан не hex',
		en: 'No hex is specified'
	},
	IS_NOT_MIME_TYPE: {
		ru: 'Указан не mime type',
		en: 'The mime type is not specified'
	},
	IS_NOT_ARRAY: {
		ru: 'Указан не массив',
		en: 'Not an array is specified'
	},
	MIN_ZERO: {
		ru: 'Минимальное значение – 0',
		en: 'The minimum value is 0'
	},
	MAX_INT4: {
		ru: 'Максимальное значение – 2147483647',
		en: 'The maximum value is 2147483647'
	},
	UNKNOWN_VALUE: {
		ru: 'Передано неизвестное значение',
		en: 'An unknown value was passed'
	}
} satisfies ErrorsType;

export const CommonErrorMessages = {
	INCORRECT_PAGINATION_PARAMS: {
		ru: 'Необходимо передать параметры пагинации',
		en: 'Pagination parameters must be passed'
	},
	IS_NOT_PAGINATION_PARAMS: {
		ru: 'Получены не параметры пагинации',
		en: 'Non-pagination parameters were obtained'
	},
	FILE_UNDEFINED: {
		ru: 'Не передан файл',
		en: 'The file was not transferred'
	}
} satisfies ErrorsType;
