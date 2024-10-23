import { Scenes } from 'telegraf';

export interface Context extends Scenes.SceneContext {}

export interface WizardContext<S = object> extends Scenes.WizardContext {
	wizard: Scenes.WizardContext['wizard'] & { state: S };
}

export interface ITelegrafError extends Error {
	type: 'warning' | 'error';
}
