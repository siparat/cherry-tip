import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModuleAsyncOptions } from 'nestjs-telegraf';
import { Context, Session } from 'src/bot/bot.interface';
import { session } from 'telegraf';

export const getTelegrafConfig = (): TelegrafModuleAsyncOptions => ({
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: (config) => ({
		token: config.get('BOT_TOKEN'),
		middlewares: [session<Session, Context>({ defaultSession: () => DEFAULT_SESSION })]
	})
});

const DEFAULT_SESSION: Session = {
	filters: {
		category: null,
		preparation: null,
		diet: null
	}
};
