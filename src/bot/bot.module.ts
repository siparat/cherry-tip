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
import { DiaryUpdate } from './updates/diary.update';
import { CalendarModule } from 'src/calendar/calendar.module';
import { SettingsUpdate } from './updates/settings.update';
import { ChangeHeightScene } from './scenes/user/change-height.scene';
import { ChangeWeightScene } from './scenes/user/change-weight.scene';
import { ChangeBirthScene } from './scenes/user/change-birth.scene';
import { ChangeSexScene } from './scenes/user/change-sex.scene';
import { ChangeActivityScene } from './scenes/user/change-activity.scene';
import { ChangeGoalTypeScene } from './scenes/user/change-goal-type.scene';

@Module({
	imports: [AuthModule, UserModule, RecipeModule, ChallengeModule, CalendarModule, HttpModule],
	providers: [
		SettingsUpdate,
		BotUpdate,
		ChallengeUpdate,
		RecipeUpdate,
		DiaryUpdate,
		BotService,
		TelegrafAuthGuard,
		RegisterScene,
		CreateProfileScene,
		CreateGoalScene,
		CreateUnitsScene,
		CreateRecipeScene,
		ChangeHeightScene,
		ChangeWeightScene,
		ChangeBirthScene,
		ChangeSexScene,
		ChangeActivityScene,
		ChangeGoalTypeScene
	]
})
export class BotModule {}
