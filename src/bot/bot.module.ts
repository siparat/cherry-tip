import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { RegisterScene } from './scenes/register.scene';
import { TelegrafAuthGuard } from './guards/telegraf-auth.guard';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [UserModule],
	providers: [TelegrafAuthGuard, BotUpdate, RegisterScene]
})
export class BotModule {}
