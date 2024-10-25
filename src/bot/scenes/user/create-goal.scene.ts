import { UseFilters } from '@nestjs/common';
import { Wizard } from 'nestjs-telegraf';
import { BotSceneNames } from 'src/bot/bot.constants';
import { TelegrafExceptionFilter } from 'src/bot/filters/telegraf-exception.filter';

@UseFilters(TelegrafExceptionFilter)
@Wizard(BotSceneNames.CREATE_GOAL)
export class CreateGoalScene {}
