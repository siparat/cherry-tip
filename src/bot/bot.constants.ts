import * as dedent from 'dedent-js';
import { ErrorsType } from 'src/common/common.interfaces';
import { BotCommand } from 'telegraf/typings/core/types/typegram';

export const BotSceneNames = {
	REGISTER: 'REGISTER',
	CREATE_PROFILE: 'CREATE_PROFILE',
	CREATE_UNITS: 'CREATE_UNITS',
	CREATE_GOAL: 'CREATE_GOAL',
	CREATE_RECIPE: 'CREATE_RECIPE',
	CHANGE_HEIGHT: 'CHANGE_HEIGHT',
	CHANGE_WEIGHT: 'CHANGE_WEIGHT',
	CHANGE_BIRTH: 'CHANGE_BIRTH',
	CHANGE_ACTIVITY: 'CHANGE_ACTIVITY',
	CHANGE_GOAL: 'CHANGE_GOAL',
	CHANGE_SEX: 'CHANGE_SEX'
};

export const BotCommands = {
	RECIPES: 'recipes',
	DIARY: 'diary',
	CHALLENGES: 'challenges',
	SETTINGS: 'settings'
};

export const BotNavigation: BotCommand[] = [
	{ command: BotCommands.RECIPES, description: '🔍 Поиск и добавление рецептов' },
	{ command: BotCommands.DIARY, description: '🍽️ Дневник питания' },
	{ command: BotCommands.CHALLENGES, description: '🎯 Челленджи' },
	{ command: BotCommands.SETTINGS, description: '⚙️ Настройки' }
];

export const BotPhrases = {
	START: dedent`
		Здесь ты можешь:

		Искать и добавлять рецепты 🍲
		Отслеживать питание 🥗
		Принять участие в челленджах 🎯
		
		Введи название блюда, и Cherry Tip подберёт рецепты. Добавляй данные о питании и следи за прогрессом. Участвуй в челленджах и двигайся к своим целям! 💪
		
		Навигация:
		${BotNavigation.map(({ command, description }) => `/${command} – ${description}`).join('\n')}
	`,
	REGISTER: {
		WELCOME: dedent`
			🌟 Добро пожаловать в *Cherry Tip* 🌟
			🍒 Ваше приложение для питания! 🍒

			🥦 Что такое Cherry Tip?
			Это универсальное приложение, которое предлагает персонализированные планы питания, отслеживание продуктов, предложения рецептов и множество челленджей, которые помогут вам достичь ваших целей питания! 🎯📱

			📊 Легко отслеживайте свой ежедневный рацион
			🎉 Устанавливайте цели и следите за их выполнением
			🍽️ Участвуйте в различных челленджах
			🍳 Добавляйте свои собственные рецепты и выбирайте из существующих диетических планов
		`,
		START: dedent`
			Сейчас мы перейдем к этапу регистрации 🚀. Нам нужно собрать несколько данных, чтобы создать твой аккаунт: почту, логин и пароль. Не переживай, все это из чата удалится, и будет безопасно! 🔒
			
			Эти данные помогут тебе войти в твой аккаунт как в мобильном приложении, так и на сайте, так что ты не потеряешь свой прогресс и сможешь всегда быть в курсе своего пути к здоровью! 💪🍏
		`,
		SEND_EMAIL: '✉️ Укажите свою почту:',
		SEND_LOGIN: '👤 Укажите логин:',
		SEND_PASSWORD: '🫣 Укажите пароль:',
		SEND_BIRTH: '📅 Укажите дату рождения в формате 2000-12-31:',
		SEND_SEX: '👫 Выберите пол:',
		SEND_HEIGHT: '🧍 Введите свой рост:',
		SEND_WEIGHT: '🏋️ Введите свой вес:',
		SEND_ACTIVITY: '🦾 Выберите свою активность:',
		SEND_GOAL: '🎯 Выберите цель:',
		SUCCESS: '🎉 Вы успешно зарегистрировались 🥳',
		GET_INFO: `Чтобы настроить рекомендации и планы под твои цели, мне нужно немного больше информации о тебе 😊 Это поможет сделать программу максимально полезной и эффективной 💪✨`
	},
	RECIPES: {
		START: dedent`
			*🍲 Рецепты*

			Здесь ты можешь найти рецепты для разнообразия своего рациона или создать свои собственные!
		`,
		SEND_TITLE: '🥗 Название рецепта:',
		SEND_DESCRIPTION: '💬 Описание (необязательно):',
		SEND_IMAGE: '🖼️ Фото рецепта:',
		SEND_PROTEIN: '🥚 Белка в 100г:',
		SEND_FAT: '🧈 Жиров в 100г:',
		SEND_CARBS: '🍫 Углеводов в 100г:',
		CREATED: '🌟 Рецепт успешно создан'
	},
	CHALLENGES: {
		START: dedent`
			*🎯 Челленджи*

			Готов испытать себя и улучшить свои привычки? Выбери челлендж и начни менять свой рацион шаг за шагом!
		`
	},
	DIARY: {
		START: dedent`
			*🍽️ Дневник питания*

			Веди свой дневник питания и наблюдай за рационом каждый день 🗓️ Добавляй блюда и продукты, чтобы отслеживать прогресс и делать более полезный выбор для себя 🍏

			🎯 Выбери день, для заполнения дневника в формате 2000-12-31:
		`
	},
	SETTINGS: {
		START: dedent`
			*⚙️ Настройки*

			Здесь ты можешь обновить параметры, которые влияют на расчёт твоих КБЖУ. Точные данные помогают составить рекомендации, которые лучше подходят именно тебе!
		`
	}
};

export const BotStickers = {
	HAPPY: 'CAACAgIAAxkBAAIBbGcausY5mHDrg2qcSjAD9aYJwqvVAAIdAAPANk8TXtim3EE93kg2BA',
	DISCONTENT: 'CAACAgIAAxkBAAIE6mcdBsO5lzMG5uzKdG-CdMTN8e-KAAIgAAPANk8T9A8ruj5f9M82BA',
	WINK: 'CAACAgIAAxkBAAIE6GcdBq8aWuU6ht1E5StxkKoRu2zQAAINAAPANk8TpPnh9NR4jVM2BA',
	SADNESS: 'CAACAgIAAxkBAAIE5mcdBqukTW5kni1fuRQbSLLO7M9YAAIQAAPANk8T6oGKKfEfAug2BA',
	LIKE: 'CAACAgIAAxkBAAIE42cdBmvdfgmOZ32xUHrzAs_yXkKlAAIVAAPANk8TzVamO2GeZOc2BA'
};

export const BotInlineTags = {
	SEARCH: '#search',
	MINE: '#mine',
	CHALLENGES: '#challenges',
	CHALLENGES_ACTIVED: '#challenges_actived',
	CHALLENGES_FINISHED: '#challenges_finished',
	DIARY_ADD: '#add',
	DIARY_REMOVE: '#remove'
};

export const BotActions = {
	LEAVE: 'SCENE_LEAVE',
	RESTART: 'SCENE_RESTART',
	REGISTER: {
		CONFIRM: 'REGISTER_CONFIRM'
	},
	RECIPES: {
		CREATE: 'RECIPES_CREATE',
		BACK: 'RECIPES_BACK',
		SKIP_DESCRIPTION: 'RECIPES_SKIP_DESCRIPTION'
	},
	CHALLENGES: {
		BACK: 'CHALLENGES_BACK',
		START: 'CHALLENGES_START',
		STOP: 'CHALLENGES_STOP'
	},
	DIARY: {
		BACK: 'DIARY_BACK',
		TODAY: 'DIARY_TODAY',
		YESTERDAY: 'DIARY_YESTERDAY',
		BREAKFAST: 'DIARY_BREAKFAST',
		LUNCH: 'DIARY_LUNCH',
		DINNARY: 'DIARY_DINNARY',
		SNACK: 'DIARY_SNACK',
		GET_MEAL_INFO: 'DIARY_GET_MEAL_INFO'
	},
	SETTINGS: {
		CHANGE_HEIGHT: 'SETTINGS_CHANGE_HEIGHT',
		CHANGE_WEIGHT: 'SETTINGS_CHANGE_WEIGHT',
		CHANGE_BIRTH: 'SETTINGS_CHANGE_BIRTH',
		CHANGE_ACTIVITY: 'SETTINGS_CHANGE_ACTIVITY',
		CHANGE_GOAL: 'SETTINGS_CHANGE_GOAL',
		CHANGE_SEX: 'SETTINGS_CHANGE_SEX'
	}
};

export const BotErrorMessages = {
	BAD_CATEGORY: {
		ru: 'Неверно указана категория',
		en: 'The category is selected incorrectly'
	},
	BAD_DATE: {
		ru: 'Неправильный формат даты, используйте 2000-12-31',
		en: 'Incorrect date format, use 2000-12-31'
	},
	BAD_FROM: {
		ru: 'Отправитель не найден',
		en: 'Sender not found'
	},
	NOT_FOUND: {
		ru: 'Рецепт не найден',
		en: 'The recipe was not found'
	},
	RECIPE_ALREADY_EXIST: {
		ru: 'Рецепт с таким именем уже существует',
		en: 'A recipe with that name already exists'
	}
} satisfies ErrorsType;
