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
import { CreateRecipeScene } from './scenes/recipe/create-recipe.scene';
import { HttpModule } from '@nestjs/axios';
import { ChallengeUpdate } from './updates/challenge.update';
import { ChallengeModule } from 'src/challenge/challenge.module';

@Module({
	imports: [AuthModule, UserModule, RecipeModule, ChallengeModule, HttpModule],
	providers: [
		ChallengeUpdate,
		RecipeUpdate,
		BotUpdate,
		BotService,
		TelegrafAuthGuard,
		RegisterScene,
		CreateProfileScene,
		CreateGoalScene,
		CreateUnitsScene,
		CreateRecipeScene
	]
})
export class BotModule {}
