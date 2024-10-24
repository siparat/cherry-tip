import { UserModel } from '@prisma/client';
import { Scenes } from 'telegraf';

export interface Session {
	user?: UserModel;
}

export interface Context extends Scenes.SceneContext {
	session: Scenes.SceneContext['session'] & Session;
}

export interface WizardContext<S = object> extends Scenes.WizardContext {
	wizard: Scenes.WizardContext['wizard'] & { state: S };
}

export interface ITelegrafError extends Error {
	type: 'warning' | 'error';
}
