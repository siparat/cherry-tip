import { ErrorsType } from 'src/common/common.interfaces';
import { BotCommand } from 'telegraf/typings/core/types/typegram';

export const BotSceneNames = {
	REGISTER: 'REGISTER',
	CREATE_PROFILE: 'CREATE_PROFILE',
	CREATE_UNITS: 'CREATE_UNITS',
	CREATE_GOAL: 'CREATE_GOAL'
};

export const BotCommands = {
	RECIPES: 'recipes',
	ADD: 'add',
	CHALLENGES: 'challenges'
};

export const BotNavigation: BotCommand[] = [
	{ command: BotCommands.RECIPES, description: '🔍 Поиск и добавление рецептов' },
	{ command: BotCommands.ADD, description: '🍽️ Добавить питание' },
	{ command: BotCommands.CHALLENGES, description: '🎯 Челленджи' }
];

export const BotPhrases = {
	START: `Здесь ты можешь:\n\nИскать и добавлять рецепты 🍲\nОтслеживать питание 🥗\nПринять участие в челленджах 🎯\n\nВведи название блюда, и Cherry Tip подберёт рецепты. Добавляй данные о питании и следи за прогрессом. Участвуй в челленджах и двигайся к своим целям! 💪\n\nНавигация:\n${BotNavigation.map(({ command, description }) => `/${command} – ${description}`).join('\n')}`,
	REGISTER: {
		WELCOME: `🌟 Добро пожаловать в *Cherry Tip* 🌟\n🍒 Ваше приложение для питания! 🍒\n\n🥦 Что такое Cherry Tip?\nЭто универсальное приложение, которое предлагает персонализированные планы питания, отслеживание продуктов, предложения рецептов и множество челленджей, которые помогут вам достичь ваших целей питания! 🎯📱\n\n📊 Легко отслеживайте свой ежедневный рацион\n🎉 Устанавливайте цели и следите за их выполнением\n🍽️ Участвовуйте в различных челленджах\n🍳 Добавляйте свои собственные рецепты и выбирайте из существующих диетических планов\n`,
		START:
			'Сейчас мы перейдем к этапу регистрации 🚀. Нам нужно собрать несколько данных, чтобы создать твой аккаунт: почту, логин и пароль. Не переживай, все это из чата удалится, и будет безопасно! 🔒\n\nЭти данные помогут тебе войти в твой аккаунт как в мобильном приложении, так и на сайте, так что ты не потеряешь свой прогресс и сможешь всегда быть в курсе своего пути к здоровью! 💪🍏',
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
		GET_INFO:
			'Чтобы настроить рекомендации и планы под твои цели, мне нужно немного больше информации о тебе 😊 Это поможет сделать программу максимально полезной и эффективной 💪✨'
	},
	RECIPES: {
		START: '*🍲 Рецепты*\n\nЗдесь ты можешь найти рецепты для разнообразия своего рациона или создать свои собственные!'
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
	MINE: '#mine'
};

export const BotActions = {
	RESTART: 'RESTART',
	REGISTER: {
		CONFIRM: 'REGISTER_CONFIRM'
	},
	RECIPES: {
		ADD: 'RECIPES_ADD',
		BACK: 'RECIPES_BACK'
	}
};

export const BotErrorMessages = {
	BAD_FROM: {
		ru: 'Отправитель не найден',
		en: 'Sender not found'
	},
	NOT_FOUND: {
		ru: 'Рецепт не найден',
		en: 'The recipe was not found'
	}
} satisfies ErrorsType;
