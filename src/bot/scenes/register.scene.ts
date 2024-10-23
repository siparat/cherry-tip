import { Wizard } from 'nestjs-telegraf';
import { BotSceneNames } from '../bot.constants';
import { UseFilters } from '@nestjs/common';
import { TelegrafExceptionFilter } from '../filters/telegraf-exception.filter';

@UseFilters(TelegrafExceptionFilter)
@Wizard(BotSceneNames.REGISTER)
export class RegisterScene {}
