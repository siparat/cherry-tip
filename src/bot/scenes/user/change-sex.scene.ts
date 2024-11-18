import { UseFilters, UseGuards } from '@nestjs/common';
import { Wizard, WizardStep, Ctx, Message, Hears } from 'nestjs-telegraf';
import { BotSceneNames, BotPhrases } from 'src/bot/bot.constants';
import { TelegrafExceptionFilter } from 'src/bot/filters/telegraf-exception.filter';
import { BaseScene } from '../base.scene';
import { SexEnum, UserModel } from '@prisma/client';
import { WizardContext } from 'src/bot/bot.interface';
import { Message as IMessage } from 'telegraf/typings/core/types/typegram';
import { SettingsUpdate } from 'src/bot/updates/settings.update';
import { TelegrafUser } from 'src/bot/decorators/telegraf-user.decorator';
import { TelegrafAuthGuard } from 'src/bot/guards/telegraf-auth.guard';
import { TelegrafError } from 'src/bot/filters/telegraf-error';
import { UserErrorMessages } from 'src/user/user.constants';
import { ProfileRepository } from 'src/user/repositories/profile.repository';
import { ProfileEntity } from 'src/user/entities/profile.entity';
import { Markup } from 'telegraf';

@UseFilters(TelegrafExceptionFilter)
@Wizard(BotSceneNames.CHANGE_SEX)
export class ChangeSexScene extends BaseScene {
	constructor(
		private profileRepository: ProfileRepository,
		private settingsUpdate: SettingsUpdate
	) {
		super();
	}

	@WizardStep(1)
	async onStart(@Ctx() ctx: WizardContext): Promise<void> {
		await ctx.reply(
			BotPhrases.REGISTER.SEND_SEX,
			Markup.keyboard([Markup.button.text('👨'), Markup.button.text('👩')])
		);
		ctx.wizard.next();
	}

	@Hears(['👩', '👨'])
	@UseGuards(TelegrafAuthGuard)
	@WizardStep(2)
	async getSex(
		@Ctx() ctx: WizardContext,
		@Message() { text }: IMessage.TextMessage,
		@TelegrafUser() user: UserModel
	): Promise<void> {
		let sex: SexEnum = SexEnum.Male;
		switch (text) {
			case '👩':
				sex = SexEnum.Female;
				break;
			case '👨':
				sex = SexEnum.Male;
				break;
		}

		const profile = await this.profileRepository.findByUserId(user.id);
		if (!profile) {
			throw new TelegrafError(UserErrorMessages.PROFILE_IS_REQUIRED.ru);
		}

		const entity = new ProfileEntity({ ...profile, sex });
		await this.profileRepository.updateProfile(user.id, entity);

		await ctx.reply('✅ Пол успешно сменён', Markup.removeKeyboard());

		await ctx.scene.leave();
		await this.settingsUpdate.onStart(ctx, user);
	}
}
