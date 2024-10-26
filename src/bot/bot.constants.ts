import { ErrorsType } from 'src/common/common.interfaces';

export const BotSceneNames = {
	REGISTER: 'REGISTER',
	CREATE_PROFILE: 'CREATE_PROFILE',
	CREATE_UNITS: 'CREATE_UNITS',
	CREATE_GOAL: 'CREATE_GOAL'
};

export const BotPhrases = {
	START: `КУ`,
	REGISTER: {
		WELCOME: `🌟 Добро пожаловать в *Cherry Tip* 🌟\n🍒 Ваше приложение для питания! 🍒\n\n🥦 Что такое Cherry Tip?\nЭто универсальное приложение, которое предлагает персонализированные планы питания, отслеживание продуктов, предложения рецептов и множество челленджей, которые помогут вам достичь ваших целей питания! 🎯📱\n\n📊 Легко отслеживайте свой ежедневный рацион\n🎉 Устанавливайте цели и следите за их выполнением\n🍽️ Участвовуйте в различных челленджах\n🍳 Добавляйте свои собственные рецепты и выбирайте из существующих диетических планов\n`,
		START:
			'Сейчас мы перейдем к этапу регистрации 🚀. Нам нужно собрать несколько данных, чтобы создать твой аккаунт: почту, логин и пароль. Не переживай, все это из чата удалится, и будет безопасно! 🔒\n\nЭти данные помогут тебе войти в твой аккаунт как в мобильном приложении, так и на сайте, так что ты не потеряешь свой прогресс и сможешь всегда быть в курсе своего пути к здоровью! 💪🍏',
		SEND_EMAIL: '✉️ Укажите свою почту:',
		SEND_LOGIN: '👤 Укажите логин:',
		SEND_PASSWORD: '🫣 Укажите пароль:',
		SUCCESS: '🎉 Вы успешно зарегистрировались 🥳'
	}
};

export const BotStickers = {
	HAPPY: 'CAACAgIAAxkBAAIBbGcausY5mHDrg2qcSjAD9aYJwqvVAAIdAAPANk8TXtim3EE93kg2BA',
	DISCONTENT: 'CAACAgIAAxkBAAIE6mcdBsO5lzMG5uzKdG-CdMTN8e-KAAIgAAPANk8T9A8ruj5f9M82BA',
	WINK: 'CAACAgIAAxkBAAIE6GcdBq8aWuU6ht1E5StxkKoRu2zQAAINAAPANk8TpPnh9NR4jVM2BA',
	SADNESS: 'CAACAgIAAxkBAAIE5mcdBqukTW5kni1fuRQbSLLO7M9YAAIQAAPANk8T6oGKKfEfAug2BA',
	LIKE: 'CAACAgIAAxkBAAIE42cdBmvdfgmOZ32xUHrzAs_yXkKlAAIVAAPANk8TzVamO2GeZOc2BA'
};

export const BotActions = {
	RESTART: 'RESTART',
	REGISTER: {
		CONFIRM: 'REGISTER_CONFIRM'
	}
};

export const BotErrorMessages = {
	BAD_FROM: {
		ru: 'Отправитель не найден',
		en: 'Sender not found'
	}
} satisfies ErrorsType;
