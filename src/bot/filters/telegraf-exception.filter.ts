import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Context, ITelegrafError } from '../bot.interface';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
	async catch(exception: ITelegrafError | HttpException, host: ArgumentsHost): Promise<unknown> {
		const telegrafHost = TelegrafArgumentsHost.create(host);
		const ctx = telegrafHost.getContext<Context>();

		if (typeof exception !== 'object' || (!('type' in exception) && !('getResponse' in exception))) {
			Logger.error(exception, 'TelegrafException');
			await ctx.reply('*⛔️ Произошла ошибка на сервере, попробуйте позже ⛔️*', { parse_mode: 'Markdown' });
			return;
		}

		if (!('type' in exception)) {
			await ctx.reply(`*⛔️ ${exception.getResponse()['ru']} ⛔️*`, { parse_mode: 'Markdown' });
			return;
		}

		switch (exception.type) {
			case 'error': {
				await ctx.reply(`*❗️ ${exception.message} ❗️*`, { parse_mode: 'Markdown' });
				return;
			}
			case 'warning': {
				await ctx.reply(`*⚠️ ${exception.message} ⚠️*`, { parse_mode: 'Markdown' });
				return;
			}
			default: {
				await ctx.reply(`*${exception.message}*`, { parse_mode: 'Markdown' });
			}
		}
	}
}
