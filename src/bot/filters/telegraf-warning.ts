import { ITelegrafError } from '../bot.interface';

export class TelegrafWarning extends Error implements ITelegrafError {
	type: ITelegrafError['type'] = 'warning';
}
