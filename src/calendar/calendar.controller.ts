import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { DayModel, DayRecipesModel, RoleEnum, UserModel } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CalendarService } from './calendar.service';
import { User } from 'src/decorators/user.decorator';
import { DayRepository } from './repositories/day.repository';
import { CalendarErrorMessages } from './calendar.constants';
import { ParseDatePipe } from 'src/pipes/parse-date.pipe';
import { SetRecipesDto } from './dto/set-recipes.dto';

@Controller('calendar')
export class CalendarController {
	constructor(
		private calendarService: CalendarService,
		private dayRepository: DayRepository
	) {}

	@UseGuards(JwtAuthGuard)
	@Get('day/:id')
	async getById(@Param('id', ParseIntPipe) id: number, @User() user: UserModel): Promise<DayModel> {
		const day = await this.dayRepository.getById(id);
		if (!day) {
			throw new NotFoundException(CalendarErrorMessages.DAY_NOT_FOUND);
		}
		if (user.role !== RoleEnum.Admin || user.id !== day.userId) {
			throw new ForbiddenException(CalendarErrorMessages.ANOTHER_DAY);
		}
		return day;
	}

	@UseGuards(JwtAuthGuard)
	@Get('day')
	async getByDate(@User() user: UserModel, @Query('date', ParseDatePipe) date: Date): Promise<DayModel> {
		const day = await this.dayRepository.getByDate(date, user.id);
		return day ?? this.calendarService.createDay(user, date);
	}

	@UsePipes(new ValidationPipe({ transform: true }))
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Post('day/recipes')
	async setRecipes(@Body() dto: SetRecipesDto, @User() user: UserModel): Promise<DayRecipesModel> {
		return this.calendarService.setRecipes(user, dto);
	}
}
