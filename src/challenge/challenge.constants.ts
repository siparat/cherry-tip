import { ErrorsType } from 'src/common/common.interfaces';

export const ChallengeErrorMessages = {
	ALREADY_EXIST_WITH_THIS_NAME: {
		ru: 'Челлендж с таким названием уже есть, укажите другое название',
		en: 'There is already a challenge with this name, please specify another name'
	},
	ALREADY_STARTED: {
		ru: 'Данный челлендж уже активен',
		en: 'This challenge is already started'
	},
	ALREADY_CANCELED: {
		ru: 'Данный челлендж уже остановлен',
		en: 'This challenge has already been stopped'
	},
	NOT_FOUND: {
		ru: 'Челлендж с таким id не найден',
		en: 'The challenge with this ID was not found'
	},
	ID_IS_MISSING_IN_ENTITY: {
		ru: 'В entity не указан id',
		en: 'The ID is not specified in the entity'
	}
} satisfies ErrorsType;

export const ChallengeDtoErrors = {
	MAX_LENGTH_TITLE: {
		ru: 'Максимальная длина заголовка – 24',
		en: 'The maximum length of the header is 24'
	},
	MIN_LENGTH_TITLE: {
		ru: 'Минимальная длина заголовка – 1',
		en: 'The minimum length of the header is 1'
	},
	MAX_LENGTH_DESCRIPTION: {
		ru: 'Максимальная длина описания – 500',
		en: 'The maximum description length is 500'
	},
	INCORRECT_DIFFICULT: {
		ru: 'Укажите верную сложность челленджа',
		en: 'Specify the correct difficulty of the challenge'
	}
} satisfies ErrorsType;
