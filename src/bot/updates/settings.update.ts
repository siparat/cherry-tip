import { Action, Command, Ctx, Update } from 'nestjs-telegraf';
import { Context } from '../bot.interface';
import { BotActions, BotCommands, BotPhrases, BotSceneNames } from '../bot.constants';
import { Markup } from 'telegraf';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TelegrafAuthGuard } from '../guards/telegraf-auth.guard';
import { TelegrafExceptionFilter } from '../filters/telegraf-exception.filter';
import { TelegrafUser } from '../decorators/telegraf-user.decorator';
import { SexEnum, UserModel } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { format } from 'date-fns';

@UseFilters(TelegrafExceptionFilter)
@Update()
export class SettingsUpdate {
	constructor(private userService: UserService) {}

	@UseGuards(TelegrafAuthGuard)
	@Command(BotCommands.SETTINGS)
	async onStart(@Ctx() ctx: Context, @TelegrafUser() { id }: UserModel): Promise<void> {
		const entity = await this.userService.getUserEntity(id);

		await ctx.reply(BotPhrases.SETTINGS.START, {
			parse_mode: 'Markdown',
			...Markup.inlineKeyboard([
				[
					Markup.button.callback(`🧍 Изменить рост (${entity?.units?.height} см)`, BotActions.SETTINGS.CHANGE_HEIGHT),
					Markup.button.callback(`🏋️ Изменить вес (${entity?.units?.weight} кг)`, BotActions.SETTINGS.CHANGE_WEIGHT)
				],
				[
					Markup.button.callback(
						`📅 Изменить дату рождения (${entity?.profile?.birth ? format(entity?.profile?.birth, 'yyyy-MM-dd') : ''})`,
						BotActions.SETTINGS.CHANGE_BIRTH
					)
				],
				[
					Markup.button.callback('🦾 Сменить активность', BotActions.SETTINGS.CHANGE_ACTIVITY),
					Markup.button.callback('🎯 Сменить цель', BotActions.SETTINGS.CHANGE_GOAL)
				],
				[
					Markup.button.callback(
						`${entity?.profile?.sex == SexEnum.Male ? '👨' : '👩'} Сменить пол`,
						BotActions.SETTINGS.CHANGE_SEX
					)
				]
			])
		});
	}

	@Action(BotActions.SETTINGS.CHANGE_HEIGHT)
	async enterChangeHeightScene(@Ctx() ctx: Context): Promise<void> {
		await ctx.scene.enter(BotSceneNames.CHANGE_HEIGHT);
	}

	@Action(BotActions.SETTINGS.CHANGE_WEIGHT)
	async enterChangeWeightScene(@Ctx() ctx: Context): Promise<void> {
		await ctx.scene.enter(BotSceneNames.CHANGE_WEIGHT);
	}

	@Action(BotActions.SETTINGS.CHANGE_BIRTH)
	async enterChangeBirthScene(@Ctx() ctx: Context): Promise<void> {
		await ctx.scene.enter(BotSceneNames.CHANGE_BIRTH);
	}

	@Action(BotActions.SETTINGS.CHANGE_ACTIVITY)
	async enterChangeActivityScene(@Ctx() ctx: Context): Promise<void> {
		await ctx.scene.enter(BotSceneNames.CHANGE_ACTIVITY);
	}

	@Action(BotActions.SETTINGS.CHANGE_GOAL)
	async enterChangeGoalScene(@Ctx() ctx: Context): Promise<void> {
		await ctx.scene.enter(BotSceneNames.CHANGE_GOAL);
	}

	@Action(BotActions.SETTINGS.CHANGE_SEX)
	async enterChangeSexScene(@Ctx() ctx: Context): Promise<void> {
		await ctx.scene.enter(BotSceneNames.CHANGE_SEX);
	}
}
