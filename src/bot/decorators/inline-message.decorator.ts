import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from '../bot.interface';

export const InlineMessage = createParamDecorator((_: unknown, ctx: ExecutionContext): string => {
	const telegrafCtx = TelegrafExecutionContext.create(ctx).getContext<Context>();
	if (!telegrafCtx.inlineQuery) {
		return '';
	}
	return telegrafCtx.inlineQuery.query.split(' ').slice(1).join(' ');
});
