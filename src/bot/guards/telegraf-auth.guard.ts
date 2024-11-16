import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from '../bot.interface';
import { UserRepository } from 'src/user/repositories/user.repository';
import { TelegrafError } from '../filters/telegraf-error';
import { AuthErrorMessages } from 'src/auth/auth.constants';

@Injectable()
export class TelegrafAuthGuard implements CanActivate {
	constructor(private userRepository: UserRepository) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = TelegrafExecutionContext.create(context).getContext<Context>();
		if (!ctx.from) {
			throw new TelegrafError(AuthErrorMessages.UNAUTHORIZED.ru);
		}
		const user = await this.userRepository.findByTgId(ctx.from.id);
		if (!user) {
			throw new TelegrafError(AuthErrorMessages.NOT_FOUND.ru);
		}
		ctx.session.user = user;
		return true;
	}
}
