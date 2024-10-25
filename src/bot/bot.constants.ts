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
		SEND_PASSWORD: '🫣 Укажите пароль:'
	}
};

export const BotStickers = {
	HAPPY: 'CAACAgIAAxkBAAIBbGcausY5mHDrg2qcSjAD9aYJwqvVAAIdAAPANk8TXtim3EE93kg2BA'
};

export const BotErrorMessages = {
	BAD_FROM: {
		ru: 'Отправитель не найден',
		en: 'Sender not found'
	}
} satisfies ErrorsType;
