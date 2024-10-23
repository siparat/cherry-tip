import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModuleAsyncOptions } from 'nestjs-telegraf';
import { session } from 'telegraf';

export const getTelegrafConfig = (): TelegrafModuleAsyncOptions => ({
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: (config) => ({
		token: config.get('BOT_TOKEN'),
		middlewares: [session()]
	})
});
