import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from '../bot.interface';

export const TelegrafUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
	return TelegrafExecutionContext.create(ctx).getContext<Context>().session.user;
});
