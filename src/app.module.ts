import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { RecipeModule } from './recipe/recipe.module';
import { ChallengeModule } from './challenge/challenge.module';
import { CalendarModule } from './calendar/calendar.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { path } from 'app-root-path';
import { BotModule } from './bot/bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { getTelegrafConfig } from './configs/telegraf.config';

@Module({
	imports: [
		AuthModule,
		UserModule,
		RecipeModule,
		ChallengeModule,
		CalendarModule,
		BotModule,
		ConfigModule.forRoot({ isGlobal: true }),
		ServeStaticModule.forRoot({ rootPath: `${join(path, 'uploads')}`, serveRoot: '/uploads' }),
		ServeStaticModule.forRoot({ rootPath: `${join(path, 'assets')}`, serveRoot: '/assets' }),
		TelegrafModule.forRootAsync(getTelegrafConfig())
	]
})
export class AppModule {}
