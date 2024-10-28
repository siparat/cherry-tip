import { Module } from '@nestjs/common';
import { BotUpdate } from './updates/bot.update';
import { RegisterScene } from './scenes/auth/register.scene';
import { TelegrafAuthGuard } from './guards/telegraf-auth.guard';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { CreateProfileScene } from './scenes/user/create-profile.scene';
import { CreateGoalScene } from './scenes/user/create-goal.scene';
import { CreateUnitsScene } from './scenes/user/create-units.scene';
import { RecipeUpdate } from './updates/recipe.update';
import { RecipeModule } from 'src/recipe/recipe.module';
import { BotService } from './bot.service';

@Module({
	imports: [AuthModule, UserModule, RecipeModule],
	providers: [
		BotService,
		TelegrafAuthGuard,
		BotUpdate,
		RecipeUpdate,
		RegisterScene,
		CreateProfileScene,
		CreateGoalScene,
		CreateUnitsScene
	]
})
export class BotModule {}
