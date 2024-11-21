import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { BotModule } from 'src/bot/bot.module';
import { CalendarModule } from 'src/calendar/calendar.module';
import { ChallengeModule } from 'src/challenge/challenge.module';
import { RecipeModule } from 'src/recipe/recipe.module';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		AuthModule,
		UserModule,
		RecipeModule,
		ChallengeModule,
		CalendarModule,
		BotModule,
		ConfigModule.forRoot({ isGlobal: true })
	]
})
export class TestAppModule {}
