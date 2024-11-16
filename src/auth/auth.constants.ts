import { ErrorsType } from 'src/common/common.interfaces';

export const AuthErrorMessages = {
	NOT_FOUND: {
		ru: 'Такой пользователь не найден',
		en: 'The user was not found'
	},
	UNAUTHORIZED: {
		ru: 'Вы не авторизованы, войдите в систему',
		en: 'You are not logged in, log in'
	},
	ALREADY_EXIST: {
		ru: 'Такой пользователь уже существует',
		en: 'This user exists'
	},
	WRONG_PASSWORD: {
		ru: 'Логин или пароль неверны',
		en: 'The login or password is incorrect'
	}
} satisfies ErrorsType;

export const AuthDtoErrors = {
	INVALID_SYMBOLS: {
		ru: 'Пароль должен содержать только цифры, буквы и специальные символы',
		en: 'The password must contain only numbers, letters and special characters'
	},
	MAX_LENGTH_LOGIN: {
		ru: 'Максимальная длина логина – 20',
		en: 'The maximum login length is 20'
	},
	MIN_LENGTH_LOGIN: {
		ru: 'Минимальная длина логина – 2',
		en: 'The maximum login length is 2'
	},
	MAX_LENGTH_PASSWORD: {
		ru: 'Максимальная длина пароля – 24',
		en: 'The maximum password length is 24'
	},
	MIN_LENGTH_PASSWORD: {
		ru: 'Минимальная длина пароля – 4',
		en: 'The minimum password length is 4'
	}
} satisfies ErrorsType;
