import { Action, Command, Ctx, InlineQuery, Message, Next, On, Sender, Update } from 'nestjs-telegraf';
import { BotActions, BotCommands, BotErrorMessages, BotInlineTags, BotPhrases, BotSceneNames } from '../bot.constants';
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
import { Message as IMessage, User } from 'telegraf/typings/core/types/typegram';
import { TelegrafError } from '../filters/telegraf-error';
import { NextFunction } from 'express';
import { UserRepository } from 'src/user/repositories/user.repository';
import { RecipeErrorMessages } from 'src/recipe/recipe.constants';

@UseFilters(TelegrafExceptionFilter)
@Update()
export class RecipeUpdate {
	constructor(
		private recipeRepository: RecipeRepository,
		private userRepository: UserRepository,
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
					Markup.button.switchToCurrentChat('👤 Мои', BotInlineTags.MINE + ' ')
				],
				[Markup.button.callback('🍲 Создать рецепт', BotActions.RECIPES.CREATE)]
			])
		});
	}

	@On('text')
	async getRecipeCard(
		@Ctx() ctx: Context,
		@Message() msg: IMessage.TextMessage,
		@Next() next: NextFunction,
		@Sender() sender: User
	): Promise<void> {
		if (!msg.via_bot || msg.via_bot.id !== ctx.botInfo.id || !msg.text.startsWith(BotInlineTags.SEARCH)) {
			return next();
		}
		const id = Number(msg.text.split(' ')[1]);
		const recipe = await this.recipeRepository.findById(id);
		if (!recipe) {
			throw new TelegrafError(BotErrorMessages.NOT_FOUND.ru);
		}
		const caption = await this.botService.constructRecipeCard(recipe);

		const buttons = [[Markup.button.callback('🔙 Назад', BotActions.RECIPES.BACK)]];
		const user = await this.userRepository.findByTgId(sender.id);
		if (user?.id == recipe.userId) {
			const params = '?' + new URLSearchParams({ id: id.toString() }).toString();
			buttons.push([Markup.button.callback('🗑 Удалить', BotActions.RECIPES.DELETE + params)]);
		}

		const keyboard = Markup.inlineKeyboard(buttons);
		try {
			await ctx.replyWithPhoto(recipe.image, { caption, parse_mode: 'Markdown', ...keyboard });
		} catch (error) {
			await ctx.reply(caption, { parse_mode: 'Markdown', link_preview_options: { is_disabled: true }, ...keyboard });
		}
	}

	@InlineQuery(getRegExpTag(BotInlineTags.SEARCH))
	async searchRecipes(@Ctx() ctx: Context, @InlineMessage() q: string): Promise<void> {
		const recipes = await this.recipeRepository.search(q, { take: 15 });
		await this.botService.sendRecipesInQuery(ctx, recipes, BotInlineTags.SEARCH);
	}

	@UseGuards(TelegrafAuthGuard)
	@InlineQuery(getRegExpTag(BotInlineTags.MINE))
	async getMineRecipes(
		@Ctx() ctx: Context,
		@TelegrafUser() user: UserModel,
		@InlineMessage() q: string
	): Promise<void> {
		const recipes = await this.recipeRepository.findMineRecipes(user.id, { take: 15 }, q);
		await this.botService.sendRecipesInQuery(ctx, recipes, BotInlineTags.SEARCH);
	}

	@Action(BotActions.RECIPES.CREATE)
	async startCreatingRecipe(@Ctx() ctx: Context): Promise<void> {
		await ctx.scene.enter(BotSceneNames.CREATE_RECIPE);
	}

	@Action(getRegExpTag(BotActions.RECIPES.DELETE))
	async deleteRecipe(@Ctx() ctx: Context): Promise<void> {
		const id = this.botService.getIdFromCallback(ctx.callbackQuery);
		const recipe = await this.recipeRepository.findById(id);
		if (!recipe) {
			throw new TelegrafError(RecipeErrorMessages.NOT_FOUND.ru);
		}

		const params = '?' + new URLSearchParams({ id: id.toString() }).toString();
		const keyboard = Markup.inlineKeyboard([
			Markup.button.callback('❌ Отмена', BotActions.RECIPES.CANCEL_DELETING),
			Markup.button.callback('✅ Удалить', BotActions.RECIPES.CONFIRM_DELETING + params)
		]);

		await ctx.reply(BotPhrases.RECIPES.CONFIRM_DELETING + recipe.title, keyboard);
	}

	@Action(getRegExpTag(BotActions.RECIPES.CONFIRM_DELETING))
	async confirmDeletingRecipe(@Ctx() ctx: Context): Promise<void> {
		const id = this.botService.getIdFromCallback(ctx.callbackQuery);
		const { title } = await this.recipeRepository.deleteRecipeById(id);
		await ctx.editMessageText(`💥 Рецепт ${title} успешно удален`);
	}

	@Action(getRegExpTag(BotActions.RECIPES.CANCEL_DELETING))
	async cancelDeletingRecipe(@Ctx() ctx: Context): Promise<void> {
		await ctx.deleteMessage();
	}
}
