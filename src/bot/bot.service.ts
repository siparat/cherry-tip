import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecipeModel } from '@prisma/client';
import * as dedent from 'dedent-js';
import { IRecipeTags } from 'src/recipe/recipe.interfaces';
import { RecipeService } from 'src/recipe/recipe.service';
import { InlineQueryResultArticle } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class BotService {
	constructor(
		private recipeService: RecipeService,
		private config: ConfigService
	) {}

	getInlineResultRecipe(recipe: RecipeModel): InlineQueryResultArticle {
		return {
			type: 'article',
			id: recipe.id.toString(),
			title: recipe.title,
			description: `🔥 ${recipe.calories} Ккал\n${recipe.protein}г • ${recipe.fat}г • ${recipe.carbs}г (БЖУ)`,
			thumbnail_url: recipe.image,
			input_message_content: { message_text: recipe.id.toString() }
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
