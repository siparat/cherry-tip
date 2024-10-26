import { Action, Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { BotActions, BotPhrases, BotSceneNames, BotStickers } from '../../bot.constants';
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
import { Markup } from 'telegraf';
import { BaseScene } from '../base.scene';

@UseFilters(TelegrafExceptionFilter)
@Wizard(BotSceneNames.REGISTER)
export class RegisterScene extends BaseScene {
	constructor(
		private userRepository: UserRepository,
		private authService: AuthService
	) {
		super();
	}

	@WizardStep(1)
	async onStart(@Ctx() ctx: WizardContext<AuthRegisterDto>): Promise<void> {
		await ctx.sendSticker(BotStickers.HAPPY);
		await ctx.reply(BotPhrases.REGISTER.WELCOME, { parse_mode: 'Markdown' });
		await ctx.reply(BotPhrases.REGISTER.START);
		await ctx.reply(BotPhrases.REGISTER.SEND_EMAIL);

		let login: string = ctx.from?.username || '';
		const user = await this.userRepository.findUniqueUser(undefined, login);
		if (user) {
			login = generateString(20);
		}
		ctx.wizard.state.login = login;

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
	async getPassword(@Ctx() ctx: WizardContext<AuthRegisterDto>, @Message() msg: IMessage.TextMessage): Promise<void> {
		const password = msg.text;
		const email = ctx.wizard.state.email;
		const login = ctx.wizard.state.login;
		const errors = await validateProp(AuthRegisterDto, 'password', password);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}

		ctx.wizard.state.password = password;
		await ctx.deleteMessage(msg.message_id);

		await ctx.reply(
			`Подтвердите регистрацию или введите данные заново\nПочта: ${email}\nЛогин: ${login}\nПароль: ${'*'.repeat(password.length)}`,
			{
				...Markup.inlineKeyboard([
					Markup.button.callback('✅ Подтвердить', BotActions.REGISTER.CONFIRM),
					Markup.button.callback('🔄 Заново', BotActions.RESTART)
				])
			}
		);
		ctx.wizard.next();
	}

	@Action(BotActions.REGISTER.CONFIRM)
	@WizardStep(4)
	async confirm(@Ctx() ctx: WizardContext<AuthRegisterDto>): Promise<void> {
		await this.authService.createUser(ctx.wizard.state, ctx.from?.id);
		ctx.editMessageText(BotPhrases.REGISTER.SUCCESS);

		await ctx.scene.leave();
		await ctx.scene.enter(BotSceneNames.CREATE_PROFILE);
	}
}
