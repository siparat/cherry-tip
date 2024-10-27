import { UserModel } from '@prisma/client';
import { Scenes } from 'telegraf';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';

export interface Session {
	user?: UserModel;
}

export interface Context extends Scenes.SceneContext {
	session: Scenes.SceneContext['session'] & Session;
	callbackQuery: CallbackQuery.DataQuery;
}

export interface WizardContext<S = object> extends Scenes.WizardContext {
	wizard: Scenes.WizardContext['wizard'] & { state: S };
	callbackQuery: CallbackQuery.DataQuery;
}

export interface ITelegrafError extends Error {
	type: 'warning' | 'error';
}
