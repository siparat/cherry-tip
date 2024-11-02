import { Action, Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { BotActions, BotErrorMessages, BotPhrases, BotSceneNames } from 'src/bot/bot.constants';
import { BaseScene } from '../base.scene';
import { WizardContext } from 'src/bot/bot.interface';
import { CreateRecipeDto } from 'src/recipe/dto/create-recipe.dto';
import { Markup } from 'telegraf';
import { Message as IMessage, PhotoSize } from 'telegraf/typings/core/types/typegram';
import { validateProp } from 'src/helpers/validation.helpers';
import { TelegrafWarning } from 'src/bot/filters/telegraf-warning';
import { RecipeRepository } from 'src/recipe/repositories/recipe.repository';
import { TelegrafError } from 'src/bot/filters/telegraf-error';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TelegrafExceptionFilter } from 'src/bot/filters/telegraf-exception.filter';
import { RecipeService } from 'src/recipe/recipe.service';
import { UserModel } from '@prisma/client';
import { TelegrafAuthGuard } from 'src/bot/guards/telegraf-auth.guard';
import { TelegrafUser } from 'src/bot/decorators/telegraf-user.decorator';
import { RecipeUpdate } from 'src/bot/updates/recipe.update';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@UseGuards(TelegrafAuthGuard)
@UseFilters(TelegrafExceptionFilter)
@Wizard(BotSceneNames.CREATE_RECIPE)
export class CreateRecipeScene extends BaseScene {
	constructor(
		private recipeRepository: RecipeRepository,
		private recipeService: RecipeService,
		private recipeUpdate: RecipeUpdate,
		private httpService: HttpService,
		private config: ConfigService
	) {
		super();
	}

	@WizardStep(1)
	async onStart(@Ctx() ctx: WizardContext<CreateRecipeDto>): Promise<void> {
		await ctx.reply(BotPhrases.RECIPES.SEND_TITLE);
		ctx.wizard.next();
	}

	@On('text')
	@WizardStep(2)
	async getTitle(@Ctx() ctx: WizardContext<CreateRecipeDto>, @Message() msg: IMessage.TextMessage): Promise<void> {
		const title = msg.text;
		const errors = await validateProp(CreateRecipeDto, 'title', title);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}

		const existedRecipe = await this.recipeRepository.findByTitle(title);
		if (existedRecipe) {
			throw new TelegrafError(BotErrorMessages.RECIPE_ALREADY_EXIST.ru);
		}

		ctx.wizard.state.title = title;
		await ctx.reply(
			BotPhrases.RECIPES.SEND_DESCRIPTION,
			Markup.inlineKeyboard([Markup.button.callback('⏩ Пропустить', BotActions.RECIPES.SKIP_DESCRIPTION)])
		);
		ctx.wizard.next();
	}

	@On('text')
	@WizardStep(3)
	async getDescription(
		@Ctx() ctx: WizardContext<CreateRecipeDto>,
		@Message() msg: IMessage.TextMessage
	): Promise<void> {
		const description = msg.text;
		const errors = await validateProp(CreateRecipeDto, 'description', description);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}
		ctx.wizard.state.description = description;
		await this.skipDescription(ctx);
	}

	@Action(BotActions.RECIPES.SKIP_DESCRIPTION)
	@WizardStep(3)
	async skipDescription(@Ctx() ctx: WizardContext): Promise<void> {
		await ctx.reply(BotPhrases.RECIPES.SEND_IMAGE);
		ctx.wizard.next();
	}

	@On('photo')
	@WizardStep(4)
	async getImage(@Ctx() ctx: WizardContext<CreateRecipeDto>, @Message() msg: IMessage.PhotoMessage): Promise<void> {
		const domain = this.config.get('DOMAIN');
		const photoId = (msg.photo.at(-1) as PhotoSize).file_id;
		const url = (await ctx.telegram.getFileLink(photoId)).toString();

		const res = await firstValueFrom(this.httpService.get<ArrayBuffer>(url, { responseType: 'arraybuffer' }));
		const buffer = Buffer.from(res.data);
		const path = await this.recipeService.saveImage({ buffer });

		ctx.wizard.state.image = domain + path;
		await ctx.reply(BotPhrases.RECIPES.SEND_PROTEIN);
		ctx.wizard.next();
	}

	@On('text')
	@WizardStep(5)
	async getProtein(@Ctx() ctx: WizardContext<CreateRecipeDto>, @Message() msg: IMessage.TextMessage): Promise<void> {
		const protein = Number(msg.text);
		const errors = await validateProp(CreateRecipeDto, 'protein', protein);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}

		ctx.wizard.state.protein = protein;
		await ctx.reply(BotPhrases.RECIPES.SEND_FAT);
		ctx.wizard.next();
	}

	@On('text')
	@WizardStep(6)
	async getFat(@Ctx() ctx: WizardContext<CreateRecipeDto>, @Message() msg: IMessage.TextMessage): Promise<void> {
		const fat = Number(msg.text);
		const errors = await validateProp(CreateRecipeDto, 'fat', fat);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}

		ctx.wizard.state.fat = fat;
		await ctx.reply(BotPhrases.RECIPES.SEND_CARBS);
		ctx.wizard.next();
	}

	@On('text')
	@WizardStep(7)
	async getCarbs(
		@Ctx() ctx: WizardContext<CreateRecipeDto>,
		@Message() msg: IMessage.TextMessage,
		@TelegrafUser() user: UserModel
	): Promise<void> {
		const carbs = Number(msg.text);
		const errors = await validateProp(CreateRecipeDto, 'carbs', carbs);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}

		ctx.wizard.state.carbs = carbs;
		await this.recipeService.createRecipe(user.id, ctx.wizard.state);
		await ctx.reply(BotPhrases.RECIPES.CREATED);
		await ctx.scene.leave();
		await this.recipeUpdate.onStart(ctx);
	}
}
