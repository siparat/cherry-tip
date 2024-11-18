import { UseFilters, UseGuards } from '@nestjs/common';
import { Wizard, WizardStep, Ctx, On } from 'nestjs-telegraf';
import { BotSceneNames, BotPhrases } from 'src/bot/bot.constants';
import { TelegrafExceptionFilter } from 'src/bot/filters/telegraf-exception.filter';
import { BaseScene } from '../base.scene';
import { GoalTypeEnum, UserModel } from '@prisma/client';
import { WizardContext } from 'src/bot/bot.interface';
import { TelegrafWarning } from 'src/bot/filters/telegraf-warning';
import { validateProp } from 'src/helpers/validation.helpers';
import { SettingsUpdate } from 'src/bot/updates/settings.update';
import { TelegrafUser } from 'src/bot/decorators/telegraf-user.decorator';
import { TelegrafAuthGuard } from 'src/bot/guards/telegraf-auth.guard';
import { TelegrafError } from 'src/bot/filters/telegraf-error';
import { UserErrorMessages } from 'src/user/user.constants';
import { Markup } from 'telegraf';
import { GoalRepository } from 'src/user/repositories/goal.repository';
import { CreateUserGoalDto } from 'src/user/dto/create-user-goal.dto';
import { GoalEntity } from 'src/user/entities/goal.entity';
import { UserService } from 'src/user/user.service';

@UseFilters(TelegrafExceptionFilter)
@Wizard(BotSceneNames.CHANGE_GOAL)
export class ChangeGoalTypeScene extends BaseScene {
	constructor(
		private goalRepository: GoalRepository,
		private settingsUpdate: SettingsUpdate,
		private userService: UserService
	) {
		super();
	}

	@WizardStep(1)
	async onStart(@Ctx() ctx: WizardContext): Promise<void> {
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
	@UseGuards(TelegrafAuthGuard)
	@WizardStep(2)
	async getGoalType(@Ctx() ctx: WizardContext, @TelegrafUser() user: UserModel): Promise<void> {
		const type = GoalTypeEnum[ctx.callbackQuery.data];

		const errors = await validateProp(CreateUserGoalDto, 'type', type);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}

		const goal = await this.goalRepository.findByUserId(user.id);
		if (!goal) {
			throw new TelegrafError(UserErrorMessages.GOAL_IS_REQUIRED.ru);
		}

		const userEntity = await this.userService.getUserEntity(user.id);
		if (!userEntity) {
			throw new TelegrafError(UserErrorMessages.NOT_FOUND.ru);
		}

		const goalEntity = new GoalEntity({ ...goal, user: userEntity, type });
		await this.goalRepository.updateGoal(user.id, goalEntity);

		await ctx.scene.leave();
		await this.settingsUpdate.onStart(ctx, user);
	}
}
