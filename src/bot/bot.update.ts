import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from './bot.interface';
import { BotErrorMessages, BotPhrases, BotSceneNames } from './bot.constants';
import { TelegrafExceptionFilter } from './filters/telegraf-exception.filter';
import { UseFilters } from '@nestjs/common';
import { UserRepository } from 'src/user/repositories/user.repository';
import { TelegrafError } from './filters/telegraf-error';
import { IAccount } from 'src/user/user.interfaces';

@UseFilters(TelegrafExceptionFilter)
@Update()
export class BotUpdate {
	constructor(private userRepository: UserRepository) {}

	@Start()
	async start(@Ctx() ctx: Context): Promise<void> {
		if (!ctx.from) {
			throw new TelegrafError(BotErrorMessages.BAD_FROM.ru);
		}

		const user = await this.userRepository.findByTgId(ctx.from.id);
		if (!user) {
			await ctx.scene.enter(BotSceneNames.REGISTER);
			return;
		}

		const account = (await this.userRepository.findAccountById(user.id)) as IAccount;
		if (!account.profile) {
			await ctx.scene.enter(BotSceneNames.CREATE_PROFILE);
			return;
		}
		if (!account.units) {
			await ctx.scene.enter(BotSceneNames.CREATE_UNITS);
			return;
		}
		if (!account.goal) {
			await ctx.scene.enter(BotSceneNames.CREATE_GOAL);
			return;
		}

		await ctx.reply(BotPhrases.START);
	}
}
