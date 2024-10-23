import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from './bot.interface';
import { BotSceneNames } from './bot.constants';
import { TelegrafExceptionFilter } from './filters/telegraf-exception.filter';
import { UseFilters } from '@nestjs/common';

@UseFilters(TelegrafExceptionFilter)
@Update()
export class BotUpdate {
	@Start()
	async start(@Ctx() ctx: Context): Promise<void> {
		ctx.scene.enter(BotSceneNames.REGISTER);
	}
}
