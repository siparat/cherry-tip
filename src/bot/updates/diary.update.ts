import { UseFilters, UseGuards } from '@nestjs/common';
import { Action, Command, Ctx, InlineQuery, Message, Next, On, Update } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../filters/telegraf-exception.filter';
import { BotActions, BotCommands, BotErrorMessages, BotInlineTags, BotPhrases } from '../bot.constants';
import { Context } from '../bot.interface';
import { Markup } from 'telegraf';
import { TelegrafAuthGuard } from '../guards/telegraf-auth.guard';
import { TelegrafUser } from '../decorators/telegraf-user.decorator';
import { CategoryEnum, RoleEnum, UserModel } from '@prisma/client';
import { DayRepository } from 'src/calendar/repositories/day.repository';
import { CalendarService } from 'src/calendar/calendar.service';
import { Message as IMessage } from 'telegraf/typings/core/types/typegram';
import { NextFunction } from 'express';
import { isISO8601 } from 'class-validator';
import { TelegrafError } from '../filters/telegraf-error';
import { BotService } from '../bot.service';
import { IDay } from 'src/calendar/calendar.interfaces';
import { getRegExpTag } from '../helpers/tags.helper';
import { CalendarDtoErrors, CalendarErrorMessages } from 'src/calendar/calendar.constants';
import { format } from 'date-fns';
import { InlineMessage } from '../decorators/inline-message.decorator';
import { RecipeRepository } from 'src/recipe/repositories/recipe.repository';
import { validateProp } from 'src/helpers/validation.helpers';
import { SetRecipesDto } from 'src/calendar/dto/set-recipes.dto';
import { CommonDtoErrors } from 'src/common/common.constants';

@UseFilters(TelegrafExceptionFilter)
@Update()
export class DiaryUpdate {
	constructor(
		private botService: BotService,
		private dayRepository: DayRepository,
		private calendarService: CalendarService,
		private recipeRepository: RecipeRepository
	) {}

	@Command(BotCommands.DIARY)
	async onStart(@Ctx() ctx: Context): Promise<void> {
		await ctx.reply(BotPhrases.DIARY.START, {
			parse_mode: 'Markdown',
			...Markup.inlineKeyboard([
				[Markup.button.callback('🌕 Сегодня (по МСК)', BotActions.DIARY.TODAY)],
				[Markup.button.callback('🌑 Вчера (по МСК)', BotActions.DIARY.YESTERDAY)]
			])
		});
	}

	@UseGuards(TelegrafAuthGuard)
	@Action(getRegExpTag(BotActions.DIARY.BACK))
	async sendCurrentDay(@Ctx() ctx: Context, @TelegrafUser() user: UserModel): Promise<void> {
		const date = new URLSearchParams(ctx.callbackQuery.data.split('?')[1]).get('date');
		if (!date || !isISO8601(date)) {
			throw new TelegrafError(BotErrorMessages.BAD_DATE.ru);
		}
		await this.sendDay(ctx, new Date(date), user);
	}

	@UseGuards(TelegrafAuthGuard)
	@On('text')
	async sendSelectedDay(
		@Ctx() ctx: Context,
		@Message() msg: IMessage.TextMessage,
		@Next() next: NextFunction,
		@TelegrafUser() user: UserModel
	): Promise<void> {
		if (!!msg.via_bot) {
			return next();
		}
		if (!isISO8601(msg.text)) {
			throw new TelegrafError(BotErrorMessages.BAD_DATE.ru);
		}
		const date = new Date(msg.text);
		await this.sendDay(ctx, date, user);
	}

	@UseGuards(TelegrafAuthGuard)
	@Action(BotActions.DIARY.TODAY)
	async sendToday(@Ctx() ctx: Context, @TelegrafUser() user: UserModel): Promise<void> {
		const date = new Date(new Date().toLocaleDateString('en-US', { timeZone: 'Europe/Moscow' }));
		await this.sendDay(ctx, date, user);
	}

	@UseGuards(TelegrafAuthGuard)
	@Action(BotActions.DIARY.YESTERDAY)
	async sendYesterday(@Ctx() ctx: Context, @TelegrafUser() user: UserModel): Promise<void> {
		const date = new Date(new Date().toLocaleDateString('en-US', { timeZone: 'Europe/Moscow' }));
		date.setDate(date.getDate() - 1);
		await this.sendDay(ctx, date, user);
	}

	@UseGuards(TelegrafAuthGuard)
	@Action(getRegExpTag(BotActions.DIARY.GET_MEAL_INFO))
	async sendMealInfo(@Ctx() ctx: Context, @TelegrafUser() user: UserModel): Promise<void> {
		const params = new URLSearchParams(ctx.callbackQuery.data.split('?')[1]);
		const id = Number(params.get('id'));
		const category = params.get('category') as CategoryEnum | null;

		if (Number.isNaN(id) || !category || !Object.keys(CategoryEnum).includes(category)) {
			throw new TelegrafError(BotErrorMessages.BAD_CATEGORY.ru);
		}
		const day = await this.dayRepository.getById(id);
		if (!day) {
			throw new TelegrafError(CalendarErrorMessages.DAY_NOT_FOUND.ru);
		}
		if (day.userId !== user.id && user.role !== RoleEnum.Admin) {
			throw new TelegrafError(CalendarErrorMessages.ANOTHER_DAY.ru);
		}
		const meal = day.meals.find((m) => m.category == category) as IDay['meals'][number];
		const inlineParams = '?' + new URLSearchParams({ date: format(day.date, 'yyyy-MM-dd'), category }).toString();

		const card = this.botService.constructMealCard(meal, day);
		const keyboard = Markup.inlineKeyboard([
			[Markup.button.switchToCurrentChat('➕ Добавить блюдо', BotInlineTags.DIARY_ADD + inlineParams + ' ')],
			[Markup.button.switchToCurrentChat('➖ Убрать блюдо', BotInlineTags.DIARY_REMOVE + inlineParams + ' ')],
			[Markup.button.callback('🔙 Назад', BotActions.DIARY.BACK + inlineParams)]
		]);

		await ctx.reply(card, { parse_mode: 'Markdown', ...keyboard });
	}

	@UseGuards(TelegrafAuthGuard)
	@InlineQuery(getRegExpTag(BotInlineTags.DIARY_ADD))
	async searchRecipes(@Ctx() ctx: Context, @InlineMessage() q: string, @Next() next: NextFunction): Promise<void> {
		if (!ctx.inlineQuery) {
			return next();
		}

		const params = new URLSearchParams(ctx.inlineQuery.query.split(' ')[0].split('?')[1]);
		const category = params.get('category');
		const date = params.get('date');

		if (!date || !isISO8601(date) || !category || !Object.keys(CategoryEnum).includes(category)) {
			return next();
		}

		const recipes = await this.recipeRepository.search(q, { take: 15 }, undefined, true);
		await this.botService.sendRecipesInQuery(ctx, recipes, BotInlineTags.DIARY_ADD + '?' + params.toString());
	}

	@UseGuards(TelegrafAuthGuard)
	@InlineQuery(getRegExpTag(BotInlineTags.DIARY_REMOVE))
	async getSelectedRecipes(
		@Ctx() ctx: Context,
		@TelegrafUser() user: UserModel,
		@Next() next: NextFunction
	): Promise<void> {
		if (!ctx.inlineQuery) {
			return next();
		}

		const params = new URLSearchParams(ctx.inlineQuery.query.split(' ')[0].split('?')[1]);
		const category = params.get('category');
		const date = params.get('date');

		if (!date || !isISO8601(date) || !category || !Object.keys(CategoryEnum).includes(category)) {
			return next();
		}

		const day = await this.dayRepository.getByDate(new Date(date), user.id);
		if (!day) {
			return next();
		}

		const recipes = day.meals.find((m) => m.category == category)?.recipes.map(({ recipe }) => recipe) || [];
		await this.botService.sendRecipesInQuery(ctx, recipes, BotInlineTags.DIARY_REMOVE + '?' + params.toString());
	}

	@UseGuards(TelegrafAuthGuard)
	@On('text')
	async addRecipe(
		@Ctx() ctx: Context,
		@Message() msg: IMessage.TextMessage,
		@TelegrafUser() user: UserModel,
		@Next() next: NextFunction
	): Promise<void> {
		if (!msg.via_bot || msg.via_bot.id !== ctx.botInfo.id || !msg.text.startsWith(BotInlineTags.DIARY_ADD)) {
			return next();
		}
		const { id, category, date } = await this.getParamsFromQueryString(msg.text);

		const day = await this.dayRepository.getByDate(date, user.id);
		if (!day) {
			throw new TelegrafError(CalendarErrorMessages.DAY_NOT_FOUND.ru);
		}
		const meal = day.meals.find((m) => m.category == category);
		if (!meal) {
			throw new TelegrafError(CalendarErrorMessages.DAY_NOT_FOUND.ru);
		}
		const recipes = meal.recipes.map(({ recipe: { id } }) => id).concat(id);
		await this.calendarService.setRecipes(user, { category, date, recipes });

		await ctx.reply(`✅ Рецепт успешно добавлен`);
	}

	@UseGuards(TelegrafAuthGuard)
	@On('text')
	async removeRecipe(
		@Ctx() ctx: Context,
		@Message() msg: IMessage.TextMessage,
		@TelegrafUser() user: UserModel,
		@Next() next: NextFunction
	): Promise<void> {
		if (!msg.via_bot || msg.via_bot.id !== ctx.botInfo.id || !msg.text.startsWith(BotInlineTags.DIARY_REMOVE)) {
			return next();
		}
		const { id, category, date } = await this.getParamsFromQueryString(msg.text);

		const day = await this.dayRepository.getByDate(date, user.id);
		if (!day) {
			throw new TelegrafError(CalendarErrorMessages.DAY_NOT_FOUND.ru);
		}
		const meal = day.meals.find((m) => m.category == category);
		if (!meal) {
			throw new TelegrafError(CalendarErrorMessages.DAY_NOT_FOUND.ru);
		}
		let recipeIsRemoved: boolean = false;
		const recipes: number[] = [];
		for (const { recipe } of meal.recipes) {
			if (!recipeIsRemoved && recipe.id == id) {
				recipeIsRemoved = true;
				continue;
			}
			recipes.push(recipe.id);
		}

		await this.calendarService.setRecipes(user, { category, date, recipes });

		await ctx.reply(`✅ Рецепт успешно убран`);
	}

	private async getParamsFromQueryString(query: string): Promise<Omit<SetRecipesDto, 'recipes'> & { id: number }> {
		const id = Number(query.split(' ')[1]);

		const params = new URLSearchParams(query.split(' ')[0].split('?')[1]);
		const category = params.get('category') as CategoryEnum | null;
		const date = new Date(params.get('date') || '');

		if (!category || (await validateProp(SetRecipesDto, 'category', category)).length) {
			throw new TelegrafError(CalendarDtoErrors.INVALID_CATEGORY.ru);
		}
		if ((await validateProp(SetRecipesDto, 'date', date)).length) {
			throw new TelegrafError(CommonDtoErrors.IS_NOT_DATE.ru);
		}

		return { id, category, date };
	}

	private async sendDay(ctx: Context, date: Date, user: UserModel): Promise<void> {
		let day: IDay | null = await this.dayRepository.getByDate(date, user.id);
		if (!day) {
			const { id } = await this.calendarService.createDay(user, date);
			day = (await this.dayRepository.getById(id)) as IDay;
		}

		const params = `?id=${day.id}&category=`;
		const card = this.botService.constructDayCard(day);

		const keyboard = Markup.inlineKeyboard([
			[Markup.button.callback('🥐 Завтрак', BotActions.DIARY.GET_MEAL_INFO + params + CategoryEnum.Breakfast)],
			[Markup.button.callback('🍛 Обед', BotActions.DIARY.GET_MEAL_INFO + params + CategoryEnum.Lunch)],
			[Markup.button.callback('🍽️ Ужин', BotActions.DIARY.GET_MEAL_INFO + params + CategoryEnum.Dinner)],
			[Markup.button.callback('🍏 Перекус', BotActions.DIARY.GET_MEAL_INFO + params + CategoryEnum.Snack)]
		]);

		await ctx.reply(card, { parse_mode: 'Markdown', ...keyboard });
	}
}
