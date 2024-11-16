import { Action, Command, Ctx, InlineQuery, Message, Next, On, Update } from 'nestjs-telegraf';
import { BotActions, BotCommands, BotInlineTags, BotPhrases } from '../bot.constants';
import { Markup } from 'telegraf';
import { Context } from '../bot.interface';
import { getRegExpTag } from '../helpers/tags.helper';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TelegrafExceptionFilter } from '../filters/telegraf-exception.filter';
import { BotService } from '../bot.service';
import { TelegrafAuthGuard } from '../guards/telegraf-auth.guard';
import { TelegrafUser } from '../decorators/telegraf-user.decorator';
import { ChallengeModel, StatusEnum, UserModel } from '@prisma/client';
import { Message as IMessage, InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { ChallengeRepository } from 'src/challenge/repositories/challenge.repository';
import { ChallengeService } from 'src/challenge/challenge.service';
import { NextFunction } from 'express';

@UseFilters(TelegrafExceptionFilter)
@Update()
export class ChallengeUpdate {
	constructor(
		private challengeRepository: ChallengeRepository,
		private challengeService: ChallengeService,
		private botService: BotService
	) {}

	@Action(BotActions.CHALLENGES.BACK)
	@Command(BotCommands.CHALLENGES)
	async onStart(@Ctx() ctx: Context): Promise<void> {
		await ctx.reply(BotPhrases.CHALLENGES.START, {
			parse_mode: 'Markdown',
			...Markup.inlineKeyboard([
				[Markup.button.switchToCurrentChat('🔎 Поиск', BotInlineTags.CHALLENGES + ' ')],
				[
					Markup.button.switchToCurrentChat('⚙️ Активные', BotInlineTags.CHALLENGES_ACTIVED + ' '),
					Markup.button.switchToCurrentChat('🏁 Завершенные', BotInlineTags.CHALLENGES_FINISHED + ' ')
				]
			])
		});
	}

	@UseGuards(TelegrafAuthGuard)
	@InlineQuery(getRegExpTag(BotInlineTags.CHALLENGES_ACTIVED))
	async getActived(@Ctx() ctx: Context, @TelegrafUser() user: UserModel): Promise<void> {
		const challenges = await this.challengeRepository.findManyByStatus(StatusEnum.Started, user.id, { take: 20 });
		await this.sendInlineAnswer(ctx, challenges);
	}

	@UseGuards(TelegrafAuthGuard)
	@InlineQuery(getRegExpTag(BotInlineTags.CHALLENGES_FINISHED))
	async getFinished(@Ctx() ctx: Context, @TelegrafUser() user: UserModel): Promise<void> {
		const challenges = await this.challengeRepository.findManyByStatus(StatusEnum.Finished, user.id, { take: 20 });
		await this.sendInlineAnswer(ctx, challenges);
	}

	@InlineQuery(getRegExpTag(BotInlineTags.CHALLENGES))
	async getChallenges(@Ctx() ctx: Context): Promise<void> {
		const challenges = await this.challengeRepository.findMany({ take: 20 });
		await this.sendInlineAnswer(ctx, challenges);
	}

	@UseGuards(TelegrafAuthGuard)
	@On('text')
	async getChallengeCard(
		@Ctx() ctx: Context,
		@Message() msg: IMessage.TextMessage,
		@TelegrafUser() user: UserModel,
		@Next() next: NextFunction
	): Promise<void> {
		if (!msg.via_bot || msg.via_bot.id !== ctx.botInfo.id || !msg.text.startsWith(BotInlineTags.CHALLENGES)) {
			return next();
		}
		const id = Number(msg.text.split(' ')[1]);
		const challenge = await this.challengeService.getStatus(id, user.id);

		const card = this.botService.constructChallengeCard(challenge);
		const keyboard = this.constructChallengeKeyboard(id, challenge.userChallenge?.status);
		await ctx.reply(card, { parse_mode: 'Markdown', ...keyboard });
	}

	@UseGuards(TelegrafAuthGuard)
	@Action(getRegExpTag(BotActions.CHALLENGES.START))
	async startChallenge(@Ctx() ctx: Context, @TelegrafUser() user: UserModel): Promise<void> {
		const id = this.botService.getIdFromCallback(ctx.callbackQuery);
		const result = await this.challengeService.startChallenge(id, user.id);

		const updatedChallenge = await this.challengeService.getStatus(id, user.id);
		const card = this.botService.constructChallengeCard(updatedChallenge);
		const keyboard = this.constructChallengeKeyboard(id, result.status);
		await ctx.editMessageText(card, { parse_mode: 'Markdown', ...keyboard });
	}

	@UseGuards(TelegrafAuthGuard)
	@Action(getRegExpTag(BotActions.CHALLENGES.STOP))
	async stopChallenge(@Ctx() ctx: Context, @TelegrafUser() user: UserModel): Promise<void> {
		const id = this.botService.getIdFromCallback(ctx.callbackQuery);
		const result = await this.challengeService.cancelChallenge(id, user.id);

		const updatedChallenge = await this.challengeService.getStatus(id, user.id);
		const card = this.botService.constructChallengeCard(updatedChallenge);
		const keyboard = this.constructChallengeKeyboard(id, result.status);
		await ctx.editMessageText(card, { parse_mode: 'Markdown', ...keyboard });
	}

	private constructChallengeKeyboard(id: number, status?: StatusEnum): Markup.Markup<InlineKeyboardMarkup> {
		const params = '?' + new URLSearchParams({ id: id.toString() }).toString();
		const mainBtn =
			status == StatusEnum.Started
				? Markup.button.callback('⛔️ Остановить', BotActions.CHALLENGES.STOP + params)
				: Markup.button.callback(
						status == StatusEnum.Finished ? '🔄 Заново' : '🚀 Старт',
						BotActions.CHALLENGES.START + params
					);
		return Markup.inlineKeyboard([[mainBtn], [Markup.button.callback('🔙 Назад', BotActions.CHALLENGES.BACK)]]);
	}

	private async sendInlineAnswer(ctx: Context, challenges: ChallengeModel[]): Promise<void> {
		const result = challenges.map((c) => this.botService.getInlineResultChallenge(c));
		try {
			await ctx.answerInlineQuery(result, { cache_time: 0 });
		} catch (error) {
			await ctx.answerInlineQuery(
				result.map(({ thumbnail_url, ...r }) => r),
				{ cache_time: 0 }
			);
		}
	}
}
