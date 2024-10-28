import { Action, Command, Ctx, InlineQuery, Message, On, Update } from 'nestjs-telegraf';
import { BotActions, BotCommands, BotErrorMessages, BotInlineTags, BotPhrases } from '../bot.constants';
import { Markup } from 'telegraf';
import { Context } from '../bot.interface';
import { getRegExpTag } from '../helpers/tags.helper';
import { InlineMessage } from '../decorators/inline-message.decorator';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TelegrafExceptionFilter } from '../filters/telegraf-exception.filter';
import { RecipeRepository } from 'src/recipe/repositories/recipe.repository';
import { BotService } from '../bot.service';
import { TelegrafAuthGuard } from '../guards/telegraf-auth.guard';
import { TelegrafUser } from '../decorators/telegraf-user.decorator';
import { UserModel } from '@prisma/client';
import { Message as IMessage } from 'telegraf/typings/core/types/typegram';
import { TelegrafError } from '../filters/telegraf-error';

@UseFilters(TelegrafExceptionFilter)
@Update()
export class RecipeUpdate {
	constructor(
		private recipeRepository: RecipeRepository,
		private botService: BotService
	) {}

	@Action(BotActions.RECIPES.BACK)
	@Command(BotCommands.RECIPES)
	async onStart(@Ctx() ctx: Context): Promise<void> {
		await ctx.reply(BotPhrases.RECIPES.START, {
			parse_mode: 'Markdown',
			...Markup.inlineKeyboard([
				[
					Markup.button.switchToCurrentChat('🔎 Поиск', BotInlineTags.SEARCH + ' '),
					Markup.button.switchToCurrentChat('👤 Мои', BotInlineTags.MINE + ' '),
					Markup.button.callback('🍲 Создать рецепт', BotActions.RECIPES.ADD)
				],
				[Markup.button.callback(`${this.filtersIsActive(ctx.session) ? '🟢' : '🎛️'} Фильтры`, BotActions.RECIPES.ADD)]
			])
		});
	}

	@On('text')
	async getRecipeCard(@Ctx() ctx: Context, @Message() msg: IMessage.TextMessage): Promise<void> {
		if (!msg.via_bot || msg.via_bot.id !== ctx.botInfo.id) {
			return;
		}
		const id = Number(msg.text);
		const recipe = await this.recipeRepository.findById(id);
		if (!recipe) {
			throw new TelegrafError(BotErrorMessages.NOT_FOUND.ru);
		}

		const caption = await this.botService.constructRecipeCard(recipe);
		const keyboard = Markup.inlineKeyboard([Markup.button.callback('🔙 Назад', BotActions.RECIPES.BACK)]);
		try {
			await ctx.replyWithPhoto(recipe.image, { caption, parse_mode: 'Markdown', ...keyboard });
		} catch (error) {
			await ctx.reply(caption, { parse_mode: 'Markdown', link_preview_options: { is_disabled: true, ...keyboard } });
		}
	}

	@InlineQuery(getRegExpTag(BotInlineTags.SEARCH))
	async searchRecipes(@Ctx() ctx: Context, @InlineMessage() q: string): Promise<void> {
		const recipes = await this.recipeRepository.search(q, { take: 15 });
		const result = recipes.map((r) => this.botService.getInlineResultRecipe(r));
		try {
			await ctx.answerInlineQuery(result, { cache_time: 0 });
		} catch (error) {
			await ctx.answerInlineQuery(
				result.map(({ thumbnail_url, ...r }) => r),
				{ cache_time: 0 }
			);
		}
	}

	@UseGuards(TelegrafAuthGuard)
	@InlineQuery(getRegExpTag(BotInlineTags.MINE))
	async getMineRecipes(@Ctx() ctx: Context, @TelegrafUser() user: UserModel): Promise<void> {
		const recipes = await this.recipeRepository.findMineRecipes(user.id, { take: 15 });
		const result = recipes.map((r) => this.botService.getInlineResultRecipe(r));

		try {
			await ctx.answerInlineQuery(result, { cache_time: 0 });
		} catch (error) {
			await ctx.answerInlineQuery(
				result.map(({ thumbnail_url, ...r }) => r),
				{ cache_time: 0 }
			);
		}
	}

	private filtersIsActive(session: Context['session']): boolean {
		return Object.values(session.filters).some((id) => !!id);
	}
}
