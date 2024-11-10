import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChallengeModel, RecipeModel } from '@prisma/client';
import * as dedent from 'dedent-js';
import { declinate } from 'src/helpers/string.helpers';
import { IRecipeTags } from 'src/recipe/recipe.interfaces';
import { RecipeService } from 'src/recipe/recipe.service';
import { CallbackQuery, InlineQueryResultArticle } from 'telegraf/typings/core/types/typegram';
import { BotInlineTags } from './bot.constants';
import { ChallengeService } from 'src/challenge/challenge.service';
import { IChallenge } from 'src/challenge/challenge.interfaces';
import { add, intervalToDuration } from 'date-fns';

@Injectable()
export class BotService {
	constructor(
		private recipeService: RecipeService,
		private challengeService: ChallengeService,
		private config: ConfigService
	) {}

	getInlineResultRecipe(recipe: RecipeModel): InlineQueryResultArticle {
		return {
			type: 'article',
			id: recipe.id.toString(),
			title: recipe.title,
			description: dedent`
				🔥 ${recipe.calories} Ккал
				${recipe.protein}г • ${recipe.fat}г • ${recipe.carbs}г (БЖУ)`,
			thumbnail_url: recipe.image,
			input_message_content: { message_text: BotInlineTags.SEARCH + ' ' + recipe.id.toString() }
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

	async constructChallengeCard(ch: IChallenge): Promise<string> {
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

	getIdFromCallback(callback: CallbackQuery.DataQuery): number {
		return Number(new URLSearchParams(callback.data.split('?')[1]).get('id'));
	}

	private async getRecipeTagsText(tags: IRecipeTags): Promise<string[]> {
		const tagsModels = await this.recipeService.getAllTags();
		const result: string[] = [];

		const category = tagsModels.categories.find((t) => t.id == tags.categoryId);
		category && result.push(category.title);

		const preparation = tagsModels.preparations.find((t) => t.id == tags.preparationId);
		preparation && result.push(preparation.title);

		const diet = tagsModels.diets.find((t) => t.id == tags.dietsTypeId);
		diet && result.push(diet.title);

		return result;
	}
}
