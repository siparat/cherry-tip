import { UseFilters, UseGuards } from '@nestjs/common';
import { Wizard, WizardStep, Ctx, On, Message } from 'nestjs-telegraf';
import { BotSceneNames, BotPhrases } from 'src/bot/bot.constants';
import { TelegrafExceptionFilter } from 'src/bot/filters/telegraf-exception.filter';
import { BaseScene } from '../base.scene';
import { UserModel } from '@prisma/client';
import { WizardContext } from 'src/bot/bot.interface';
import { Message as IMessage } from 'telegraf/typings/core/types/typegram';
import { TelegrafWarning } from 'src/bot/filters/telegraf-warning';
import { CreateUserUnitsDto } from 'src/user/dto/create-user-units.dto';
import { validateProp } from 'src/helpers/validation.helpers';
import { SettingsUpdate } from 'src/bot/updates/settings.update';
import { TelegrafUser } from 'src/bot/decorators/telegraf-user.decorator';
import { TelegrafAuthGuard } from 'src/bot/guards/telegraf-auth.guard';
import { UnitsRepository } from 'src/user/repositories/units.repository';
import { TelegrafError } from 'src/bot/filters/telegraf-error';
import { UserErrorMessages } from 'src/user/user.constants';
import { UnitsEntity } from 'src/user/entities/units.entity';

@UseFilters(TelegrafExceptionFilter)
@Wizard(BotSceneNames.CHANGE_HEIGHT)
export class ChangeHeightScene extends BaseScene {
	constructor(
		private unitsRepository: UnitsRepository,
		private settingsUpdate: SettingsUpdate
	) {
		super();
	}

	@WizardStep(1)
	async onStart(@Ctx() ctx: WizardContext): Promise<void> {
		await ctx.reply(BotPhrases.REGISTER.SEND_HEIGHT);
		ctx.wizard.next();
	}

	@On('text')
	@UseGuards(TelegrafAuthGuard)
	@WizardStep(2)
	async getHeight(
		@Ctx() ctx: WizardContext,
		@Message() { text }: IMessage.TextMessage,
		@TelegrafUser() user: UserModel
	): Promise<void> {
		const height = Number(text);
		const errors = await validateProp(CreateUserUnitsDto, 'height', height);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}

		const units = await this.unitsRepository.findByUserId(user.id);
		if (!units) {
			throw new TelegrafError(UserErrorMessages.UNITS_IS_REQUIRED.ru);
		}

		const entity = new UnitsEntity({ ...units, height });
		await this.unitsRepository.updateUnitsModel(user.id, entity);

		await ctx.scene.leave();
		await this.settingsUpdate.onStart(ctx, user);
	}
}
