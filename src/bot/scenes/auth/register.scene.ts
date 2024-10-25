import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { BotPhrases, BotSceneNames, BotStickers } from '../../bot.constants';
import { UseFilters } from '@nestjs/common';
import { TelegrafExceptionFilter } from '../../filters/telegraf-exception.filter';
import { WizardContext } from '../../bot.interface';
import { Message as IMessage } from 'telegraf/typings/core/types/typegram';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { TelegrafError } from 'src/bot/filters/telegraf-error';
import { AuthErrorMessages } from 'src/auth/auth.constants';
import { validateProp } from 'src/helpers/validation.helpers';
import { TelegrafWarning } from 'src/bot/filters/telegraf-warning';
import { AuthService } from 'src/auth/auth.service';
import { generateString } from 'src/helpers/string.helpers';

@UseFilters(TelegrafExceptionFilter)
@Wizard(BotSceneNames.REGISTER)
export class RegisterScene {
	constructor(
		private userRepository: UserRepository,
		private authService: AuthService
	) {}

	@WizardStep(1)
	async welcome(@Ctx() ctx: WizardContext): Promise<void> {
		await ctx.sendSticker(BotStickers.HAPPY);
		await ctx.reply(BotPhrases.REGISTER.WELCOME, { parse_mode: 'Markdown' });
		await ctx.reply(BotPhrases.REGISTER.START);
		await ctx.reply(BotPhrases.REGISTER.SEND_EMAIL);
		ctx.wizard.next();
	}

	@On('text')
	@WizardStep(2)
	async getEmail(@Ctx() ctx: WizardContext<AuthRegisterDto>, @Message() msg: IMessage.TextMessage): Promise<void> {
		const email = msg.text;
		const errors = await validateProp(AuthRegisterDto, 'email', email);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}
		const user = await this.userRepository.findByEmail(email);
		if (user) {
			throw new TelegrafError(AuthErrorMessages.ALREADY_EXIST.ru);
		}
		ctx.wizard.state.email = email;
		await ctx.reply(BotPhrases.REGISTER.SEND_PASSWORD);
		ctx.wizard.next();
	}

	@On('text')
	@WizardStep(3)
	async onRegister(@Ctx() ctx: WizardContext<AuthRegisterDto>, @Message() msg: IMessage.TextMessage): Promise<void> {
		const password = msg.text;
		const errors = await validateProp(AuthRegisterDto, 'password', password);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}

		let login: string = ctx.from?.username || '';
		const user = await this.userRepository.findUniqueUser(undefined, login);
		if (user) {
			login = generateString(20);
		}

		ctx.wizard.state.password = password;
		ctx.wizard.state.login = login;
		await ctx.deleteMessage(msg.message_id);

		await this.authService.createUser(ctx.wizard.state, ctx.from?.id);

		await ctx.scene.leave();
		await ctx.scene.enter(BotSceneNames.CREATE_PROFILE);
	}
}
