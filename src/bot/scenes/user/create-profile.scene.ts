import { UseFilters } from '@nestjs/common';
import { Ctx, Hears, Message, On, Sender, Wizard, WizardStep } from 'nestjs-telegraf';
import { BotPhrases, BotSceneNames } from 'src/bot/bot.constants';
import { TelegrafExceptionFilter } from 'src/bot/filters/telegraf-exception.filter';
import { BaseScene } from '../base.scene';
import { WizardContext } from 'src/bot/bot.interface';
import { CreateUserProfileDto } from 'src/user/dto/create-user-profile.dto';
import { Markup } from 'telegraf';
import { Message as IMessage, User } from 'telegraf/typings/core/types/typegram';
import { ProfileModel, SexEnum } from '@prisma/client';
import { validateProp } from 'src/helpers/validation.helpers';
import { TelegrafWarning } from 'src/bot/filters/telegraf-warning';
import { UserRepository } from 'src/user/repositories/user.repository';
import { TelegrafError } from 'src/bot/filters/telegraf-error';
import { UserErrorMessages } from 'src/user/user.constants';
import { UserService } from 'src/user/user.service';

@UseFilters(TelegrafExceptionFilter)
@Wizard(BotSceneNames.CREATE_PROFILE)
export class CreateProfileScene extends BaseScene {
	constructor(
		private userRepository: UserRepository,
		private userService: UserService
	) {
		super();
	}

	@WizardStep(1)
	async onStart(@Ctx() ctx: WizardContext<CreateUserProfileDto>): Promise<void> {
		await ctx.reply(BotPhrases.REGISTER.GET_INFO);
		await ctx.reply(
			BotPhrases.REGISTER.SEND_SEX,
			Markup.keyboard([Markup.button.text('👨'), Markup.button.text('👩')])
		);

		ctx.wizard.state.firstName = ctx.from?.first_name || ctx.from?.username || '';

		ctx.wizard.next();
	}

	@Hears(['👩', '👨'])
	@WizardStep(2)
	async getSex(@Ctx() ctx: WizardContext<CreateUserProfileDto>, @Message() msg: IMessage.TextMessage): Promise<void> {
		switch (msg.text) {
			case '👩':
				ctx.wizard.state.sex = SexEnum.Female;
				break;
			case '👨':
				ctx.wizard.state.sex = SexEnum.Male;
				break;
		}
		await ctx.reply(BotPhrases.REGISTER.SEND_BIRTH, Markup.removeKeyboard());
		ctx.wizard.next();
	}

	@On('text')
	@WizardStep(3)
	async getBirth(
		@Ctx() ctx: WizardContext<CreateUserProfileDto>,
		@Message() msg: IMessage.TextMessage,
		@Sender() sender: User
	): Promise<void> {
		const birth = new Date(msg.text);
		const errors = await validateProp(CreateUserProfileDto, 'birth', birth);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}
		ctx.wizard.state.birth = birth;
		await this.createProfile(sender.id, ctx.wizard.state);
		await ctx.scene.leave();
		await ctx.scene.enter(BotSceneNames.CREATE_UNITS);
	}

	private async createProfile(userTgId: number, dto: CreateUserProfileDto): Promise<ProfileModel> {
		const user = await this.userRepository.findByTgId(userTgId);
		if (!user) {
			throw new TelegrafError(UserErrorMessages.NOT_FOUND.ru);
		}
		return this.userService.createProfile(user.id, dto);
	}
}
