import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { RegisterScene } from './scenes/register.scene';

@Module({
	providers: [BotUpdate, RegisterScene]
})
export class BotModule {}
