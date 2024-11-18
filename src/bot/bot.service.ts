import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CategoryEnum, ChallengeModel, GoalTypeEnum, RecipeModel } from '@prisma/client';
import * as dedent from 'dedent-js';
import { declinate } from 'src/helpers/string.helpers';
import { IRecipeShortInfo, IRecipeTags } from 'src/recipe/recipe.interfaces';
import { RecipeService } from 'src/recipe/recipe.service';
import { CallbackQuery, InlineQueryResultArticle } from 'telegraf/typings/core/types/typegram';
import { BotInlineTags } from './bot.constants';
import { IChallenge } from 'src/challenge/challenge.interfaces';
import { add, intervalToDuration, format } from 'date-fns';
import { IDay } from 'src/calendar/calendar.interfaces';
import { ru } from 'date-fns/locale';
import { Context } from './bot.interface';
import { randomInt } from 'crypto';

@Injectable()
export class BotService {
	constructor(
		private recipeService: RecipeService,
		private config: ConfigService
	) {}

	getInlineResultRecipe(recipe: IRecipeShortInfo, tag: string): InlineQueryResultArticle {
		return {
			type: 'article',
			id: recipe.id.toString() + randomInt(64),
			title: recipe.title,
			description: dedent`
				🔥 ${recipe.calories} Ккал
				${recipe.protein}г • ${recipe.fat}г • ${recipe.carbs}г (БЖУ)`,
			thumbnail_url: recipe.image,
			input_message_content: { message_text: tag + ' ' + recipe.id.toString() }
		};
	}

	getInlineResultChallenge(challenge: ChallengeModel): InlineQueryResultArticle {
		return {
			type: 'article',
			id: challenge.id.toString(),
			title: challenge.title,
			description: dedent`
				⚡️ ${challenge.difficulty}
				🕖 ${challenge.durationDays} ${declinate(challenge.durationDays, ['день', 'дня', 'дней'])}
			`,
			input_message_content: { message_text: BotInlineTags.CHALLENGES + ' ' + challenge.id.toString() }
		};
	}

	async constructRecipeCard(recipe: RecipeModel): Promise<string> {
		const tags = await this.getRecipeTagsText(recipe);

		const info: string = dedent`
			*${recipe.title} • 🔥 ${recipe.calories} Ккал*

			🥚 Белков –  *${recipe.protein}г*
			🧈 Жиров – *${recipe.fat}г*
			🍫 Углеводов – *${recipe.carbs}г*
			${tags.length ? `\n🏷️* ${tags.join(' • ')}*` : ''}
			${recipe.cookingTime ? `🕒 *${recipe.cookingTime} мин.*` : ''}
		`;

		const mobileAppUrl = this.config.get('MOBILE_APP_URL');
		const mobileAppMessage = `*Весь рецепт можно посмотреть в* [мобильном приложении](${mobileAppUrl})`;
		const maxLength = 1024 - (info.length + mobileAppMessage.length);

		if (!recipe.description) {
			return info;
		}

		try {
			const parsedDescription = JSON.parse(recipe.description)
				.map(({ text }, i: number) => `${i + 1}. ${text}`)
				.join('\n');

			const shortDescription = `${parsedDescription.slice(0, maxLength)}...\n\n${mobileAppMessage}`;

			return `${info}\n${parsedDescription.length > maxLength ? shortDescription : parsedDescription}`;
		} catch {
			return info;
		}
	}

	constructChallengeCard(ch: IChallenge): string {
		const remainedTime =
			ch.userChallenge &&
			intervalToDuration({
				start: new Date(),
				end: add(ch.userChallenge.startDate, { days: ch.durationDays })
			});

		const info: string = dedent`
			*🎯 ${ch.title}${ch.userChallenge && ch.userChallenge.status !== 'Canceled' ? ` • ${ch.userChallenge.status == 'Started' ? 'Активный' : 'Завершённый'}` : ''}*
			${ch.userChallenge?.status == 'Started' ? `\n⏳ Осталось: *${remainedTime?.days || 0}д. ${remainedTime?.hours || 0}ч. ${remainedTime?.minutes || 0}мин.*` : ''}
			🕖 Длительность: *${ch.durationDays} ${declinate(ch.durationDays, ['день', 'дня', 'дней'])}*
			⚡️ Сложность: *${ch.difficulty}*

			*Советы:*
			${ch.tips.join('\n\n')}
		`;

		return info;
	}

	constructDayCard(day: IDay): string {
		const calories: Record<CategoryEnum, number> = { Breakfast: 0, Lunch: 0, Dinner: 0, Snack: 0 };
		let protein: number = 0;
		let fat: number = 0;
		let carbs: number = 0;

		day.meals.forEach((m) => {
			m.recipes.forEach(({ recipe }) => {
				calories[m.category] += recipe.calories;
				protein += recipe.protein.toNumber();
				fat += recipe.fat.toNumber();
				carbs += recipe.carbs.toNumber();
			});
		});

		let goal: string;

		switch (day.goal) {
			case GoalTypeEnum.Gain:
				goal = 'Набор массы';
				break;
			case GoalTypeEnum.Lose:
				goal = 'Похудение';
				break;
			case GoalTypeEnum.Stay:
				goal = 'Поддержание веса';
				break;
		}

		const eatenCalories = calories.Breakfast + calories.Dinner + calories.Lunch + calories.Snack;
		const remained = day.needCalories - eatenCalories;

		const info: string = dedent`
			*📅 ${format(day.date, "d MMMM yyyy' г.'", { locale: ru })} • 🔥 ${day.needCalories} Ккал*

			🍴 *Съедено:* ${eatenCalories} Ккал
			${remained >= 0 ? `*🍲 Осталось:* ${remained}` : `*😋 Переедание:* ${remained * -1}`} Ккал
			🎯 *Цель в этот день:* ${goal}

			🥚 *Белки:* ${protein} / ${day.protein} грамм
			🧈 *Жиры:* ${fat} / ${day.fat} грамм
			🍫 *Углеводы:* ${carbs} / ${day.carbs} грамм

			*Приемы пищи:*
			🥐 *Завтрак:* ${calories.Breakfast} / ${day.breakfast}
			🍛 *Обед:* ${calories.Lunch} / ${day.lunch}
			🍽️ *Ужин:* ${calories.Dinner} / ${day.dinner}
			🍏 *Перекус:* ${calories.Snack} / ${day.snack}
		`;

		return info;
	}

	constructMealCard(meal: IDay['meals'][number], day: IDay): string {
		let calories: number = 0;
		let protein: number = 0;
		let fat: number = 0;
		let carbs: number = 0;

		let mealName: string;
		let needCalories: number = 0;

		meal.recipes.forEach(({ recipe }) => {
			calories += recipe.calories;
			protein += recipe.protein.toNumber();
			fat += recipe.fat.toNumber();
			carbs += recipe.carbs.toNumber();
		});

		switch (meal.category) {
			case CategoryEnum.Breakfast:
				mealName = '🥐 Завтрак';
				needCalories = day.breakfast;
				break;
			case CategoryEnum.Lunch:
				mealName = '🍛 Обед';
				needCalories = day.lunch;
				break;
			case CategoryEnum.Dinner:
				mealName = '🍽️ Ужин';
				needCalories = day.dinner;
				break;
			case CategoryEnum.Snack:
				mealName = '🍏 Перекус';
				needCalories = day.snack;
				break;
		}

		const info = dedent`
			*${mealName} • ${format(day.date, 'yyyy-MM-dd')}*

			*🔥 ${calories} / ${needCalories} Ккал*
			*🥚 ${protein}г 🧈 ${fat}г 🍫 ${carbs}г*

			*Список блюд:*
			${meal.recipes.length == 0 ? 'Пусто' : ''}${meal.recipes
				.slice(0, 20)
				.map(({ recipe }) => `*${recipe.title}* 🔥 ${recipe.calories} Ккал`)
				.join('\n')}
			${meal.recipes.length > 20 ? '*...*' : ''}
		`;

		return info;
	}

	async sendRecipesInQuery(ctx: Context, recipes: IRecipeShortInfo[], tag: string): Promise<void> {
		const result = recipes.map((r) => this.getInlineResultRecipe(r, tag));
		try {
			await ctx.answerInlineQuery(result, { cache_time: 0 });
		} catch (error) {
			await ctx.answerInlineQuery(
				result.map(({ thumbnail_url, ...r }) => r),
				{ cache_time: 0 }
			);
		}
	}

	getIdFromCallback(callback: CallbackQuery.DataQuery): number {
		return Number(new URLSearchParams(callback.data.split('?')[1]).get('id'));
	}

	private async getRecipeTagsText(tags: IRecipeTags): Promise<string[]> {
		const tagsModels = await this.recipeService.getAllTags();
		const result: string[] = [];

		const category = tagsModels.categories.find((t) => t.id == tags.categoryId);
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		category && result.push(category.title);

		const preparation = tagsModels.preparations.find((t) => t.id == tags.preparationId);
		preparation && result.push(preparation.title);

		const diet = tagsModels.diets.find((t) => t.id == tags.dietsTypeId);
		diet && result.push(diet.title);

		return result;
	}
}
