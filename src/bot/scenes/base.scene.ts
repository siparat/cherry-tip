import { Action, Ctx } from 'nestjs-telegraf';
import { WizardContext } from '../bot.interface';
import { BotActions } from '../bot.constants';

export abstract class BaseScene {
	abstract onStart(ctx: WizardContext): unknown;

	@Action(BotActions.RESTART)
	async restart(@Ctx() ctx: WizardContext): Promise<void> {
		ctx.wizard.selectStep(0);
		await this.onStart(ctx);
	}
}
