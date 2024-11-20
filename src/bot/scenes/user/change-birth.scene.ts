import { UseFilters, UseGuards } from '@nestjs/common';
import { Wizard, WizardStep, Ctx, On, Message } from 'nestjs-telegraf';
import { BotSceneNames, BotPhrases } from 'src/bot/bot.constants';
import { TelegrafExceptionFilter } from 'src/bot/filters/telegraf-exception.filter';
import { BaseScene } from '../base.scene';
import { UserModel } from '@prisma/client';
import { WizardContext } from 'src/bot/bot.interface';
import { Message as IMessage } from 'telegraf/typings/core/types/typegram';
import { TelegrafWarning } from 'src/bot/filters/telegraf-warning';
import { validateProp } from 'src/helpers/validation.helpers';
import { SettingsUpdate } from 'src/bot/updates/settings.update';
import { TelegrafUser } from 'src/bot/decorators/telegraf-user.decorator';
import { TelegrafAuthGuard } from 'src/bot/guards/telegraf-auth.guard';
import { TelegrafError } from 'src/bot/filters/telegraf-error';
import { UserErrorMessages } from 'src/user/user.constants';
import { CreateUserProfileDto } from 'src/user/dto/create-user-profile.dto';
import { ProfileRepository } from 'src/user/repositories/profile.repository';
import { ProfileEntity } from 'src/user/entities/profile.entity';

@UseFilters(TelegrafExceptionFilter)
@Wizard(BotSceneNames.CHANGE_BIRTH)
export class ChangeBirthScene extends BaseScene {
	constructor(
		private profileRepository: ProfileRepository,
		private settingsUpdate: SettingsUpdate
	) {
		super();
	}

	@WizardStep(1)
	async onStart(@Ctx() ctx: WizardContext): Promise<void> {
		await ctx.reply(BotPhrases.REGISTER.SEND_BIRTH);
		ctx.wizard.next();
	}

	@On('text')
	@UseGuards(TelegrafAuthGuard)
	@WizardStep(2)
	async getBirth(
		@Ctx() ctx: WizardContext,
		@Message() { text }: IMessage.TextMessage,
		@TelegrafUser() user: UserModel
	): Promise<void> {
		const birth = new Date(text);
		const errors = await validateProp(CreateUserProfileDto, 'birth', birth);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}

		const profile = await this.profileRepository.findByUserId(user.id);
		if (!profile) {
			throw new TelegrafError(UserErrorMessages.PROFILE_IS_REQUIRED.ru);
		}

		const entity = new ProfileEntity({ ...profile, birth });
		await this.profileRepository.updateProfile(user.id, entity);

		await ctx.scene.leave();
		await this.settingsUpdate.onStart(ctx, user);
	}
}
