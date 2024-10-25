import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { RegisterScene } from './scenes/auth/register.scene';
import { TelegrafAuthGuard } from './guards/telegraf-auth.guard';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { CreateProfileScene } from './scenes/user/create-profile.scene';
import { CreateGoalScene } from './scenes/user/create-goal.scene';
import { CreateUnitsScene } from './scenes/user/create-units.scene';

@Module({
	imports: [AuthModule, UserModule],
	providers: [TelegrafAuthGuard, BotUpdate, RegisterScene, CreateProfileScene, CreateGoalScene, CreateUnitsScene]
})
export class BotModule {}
