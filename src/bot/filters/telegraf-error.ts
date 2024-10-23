import { ITelegrafError } from '../bot.interface';

export class TelegrafError extends Error implements ITelegrafError {
	type: ITelegrafError['type'] = 'error';
}
