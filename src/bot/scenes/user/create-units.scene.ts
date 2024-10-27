import { UseFilters } from '@nestjs/common';
import { UnitsModel } from '@prisma/client';
import { Ctx, Message, On, Sender, Wizard, WizardStep } from 'nestjs-telegraf';
import { BotPhrases, BotSceneNames } from 'src/bot/bot.constants';
import { WizardContext } from 'src/bot/bot.interface';
import { TelegrafError } from 'src/bot/filters/telegraf-error';
import { TelegrafExceptionFilter } from 'src/bot/filters/telegraf-exception.filter';
import { TelegrafWarning } from 'src/bot/filters/telegraf-warning';
import { validateProp } from 'src/helpers/validation.helpers';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserErrorMessages } from 'src/user/user.constants';
import { UserService } from 'src/user/user.service';
import { User } from 'telegraf/typings/core/types/typegram';
import { BaseScene } from '../base.scene';
import { Message as IMessage } from 'telegraf/typings/core/types/typegram';
import { CreateUserUnitsDto } from 'src/user/dto/create-user-units.dto';

@UseFilters(TelegrafExceptionFilter)
@Wizard(BotSceneNames.CREATE_UNITS)
export class CreateUnitsScene extends BaseScene {
	constructor(
		private userRepository: UserRepository,
		private userService: UserService
	) {
		super();
	}

	@WizardStep(1)
	async onStart(@Ctx() ctx: WizardContext<CreateUserUnitsDto>): Promise<void> {
		await ctx.reply(BotPhrases.REGISTER.SEND_HEIGHT);
		ctx.wizard.next();
	}

	@On('text')
	@WizardStep(2)
	async getHeight(@Ctx() ctx: WizardContext<CreateUserUnitsDto>, @Message() msg: IMessage.TextMessage): Promise<void> {
		const height = Number(msg.text);
		const errors = await validateProp(CreateUserUnitsDto, 'height', height);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}
		ctx.wizard.state.height = height;
		await ctx.reply(BotPhrases.REGISTER.SEND_WEIGHT);
		ctx.wizard.next();
	}

	@On('text')
	@WizardStep(3)
	async getBirth(
		@Ctx() ctx: WizardContext<CreateUserUnitsDto>,
		@Message() msg: IMessage.TextMessage,
		@Sender() sender: User
	): Promise<void> {
		const weight = Number(msg.text);
		const errors = await validateProp(CreateUserUnitsDto, 'weight', weight);
		if (errors.length) {
			throw new TelegrafWarning(errors[0]);
		}
		ctx.wizard.state.weight = weight;

		await this.createUnitsModel(sender.id, ctx.wizard.state);
		await ctx.scene.leave();
		await ctx.scene.enter(BotSceneNames.CREATE_GOAL);
	}

	private async createUnitsModel(userTgId: number, dto: CreateUserUnitsDto): Promise<UnitsModel> {
		const user = await this.userRepository.findByTgId(userTgId);
		if (!user) {
			throw new TelegrafError(UserErrorMessages.NOT_FOUND.ru);
		}
		return this.userService.createUnitsModel(user.id, dto);
	}
}
