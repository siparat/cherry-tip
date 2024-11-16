import { UseFilters } from '@nestjs/common';
import { Ctx, On, Sender, Wizard, WizardStep } from 'nestjs-telegraf';
import { BotPhrases, BotSceneNames } from 'src/bot/bot.constants';
import { TelegrafExceptionFilter } from 'src/bot/filters/telegraf-exception.filter';
import { BaseScene } from '../base.scene';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserService } from 'src/user/user.service';
import { WizardContext } from 'src/bot/bot.interface';
import { Markup } from 'telegraf';
import { ActivityEnum, GoalModel, GoalTypeEnum } from '@prisma/client';
import { CreateUserGoalDto } from 'src/user/dto/create-user-goal.dto';
import { validateProp } from 'src/helpers/validation.helpers';
import { TelegrafWarning } from 'src/bot/filters/telegraf-warning';
import { UserErrorMessages } from 'src/user/user.constants';
import { TelegrafError } from 'src/bot/filters/telegraf-error';
import { User } from 'telegraf/typings/core/types/typegram';

@UseFilters(TelegrafExceptionFilter)
@Wizard(BotSceneNames.CREATE_GOAL)
export class CreateGoalScene extends BaseScene {
	constructor(
		private userRepository: UserRepository,
		private userService: UserService
	) {
		super();
	}

	@WizardStep(1)
	async onStart(@Ctx() ctx: WizardContext<CreateUserGoalDto>): Promise<void> {
		await ctx.reply(
			BotPhrases.REGISTER.SEND_ACTIVITY,
			Markup.inlineKeyboard([
				[Markup.button.callback('☀️ Не тренируюсь', ActivityEnum.Low)],
				[Markup.button.callback('💥 Тренировки 1-3 раза в неделю', ActivityEnum.Medium)],
				[Markup.button.callback('🔥 Тренировки 4-5 раз в неделю', ActivityEnum.High)]
			])
		);
		ctx.wizard.next();
	}

	@On('callback_query')
	@WizardStep(2)
	async getActivity(@Ctx() ctx: WizardContext<CreateUserGoalDto>): Promise<void> {
		const activity = ActivityEnum[ctx.callbackQuery.data];

		const errors = await validateProp(CreateUserGoalDto, 'activity', activity);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}
		ctx.wizard.state.activity = activity;

		await ctx.reply(
			BotPhrases.REGISTER.SEND_GOAL,
			Markup.inlineKeyboard([
				[Markup.button.callback('🧘 Поддержание веса', GoalTypeEnum.Stay)],
				[Markup.button.callback('🥗 Потеря веса', GoalTypeEnum.Lose)],
				[Markup.button.callback('🏋️ Набор мышечной массы', GoalTypeEnum.Gain)]
			])
		);
		ctx.wizard.next();
	}

	@On('callback_query')
	@WizardStep(3)
	async getGoalType(@Ctx() ctx: WizardContext<CreateUserGoalDto>, @Sender() sender: User): Promise<void> {
		const type = GoalTypeEnum[ctx.callbackQuery.data];

		const errors = await validateProp(CreateUserGoalDto, 'type', type);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}
		ctx.wizard.state.type = type;

		await this.createGoal(sender.id, ctx.wizard.state);

		await ctx.reply('🎉 Настройка аккаунта завершена');
		await ctx.scene.leave();
		await ctx.reply(BotPhrases.START);
	}

	private async createGoal(userTgId: number, dto: CreateUserGoalDto): Promise<GoalModel> {
		const user = await this.userRepository.findByTgId(userTgId);
		if (!user) {
			throw new TelegrafError(UserErrorMessages.NOT_FOUND.ru);
		}
		return this.userService.createGoal(user, dto);
	}
}
