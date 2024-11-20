import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DayModel, DayMealModel, UserModel } from '@prisma/client';
import { DayRepository } from './repositories/day.repository';
import { DayEntity as DayEntity } from './entities/day.entity';
import { UserService } from 'src/user/user.service';
import { AuthErrorMessages } from 'src/auth/auth.constants';
import { SetRecipesDto } from './dto/set-recipes.dto';
import { CalendarErrorMessages } from './calendar.constants';

@Injectable()
export class CalendarService {
	constructor(
		private dayRepository: DayRepository,
		private userService: UserService,
		private logger: Logger
	) {}

	async createDay(user: UserModel, date: Date): Promise<DayModel> {
		const userEntity = await this.userService.getUserEntity(user.id);
		if (!userEntity) {
			throw new NotFoundException(AuthErrorMessages.NOT_FOUND);
		}
		const entity = new DayEntity({ user: userEntity, date });
		return this.dayRepository.create(entity);
	}

	async setRecipes(user: UserModel, dto: SetRecipesDto): Promise<DayMealModel> {
		const existedDay = await this.dayRepository.getByDate(dto.date, user.id);
		if (!existedDay) {
			await this.createDay(user, dto.date);
		}
		const recipeDay = await this.dayRepository.getMealByDate(dto.date, dto.category, user.id);
		if (!recipeDay) {
			throw new BadRequestException(CalendarErrorMessages.DAY_NOT_FOUND);
		}
		const result = await this.dayRepository.setRecipes(recipeDay.id, dto.recipes);
		this.logger.log(`User ${user.id} set the meal for ${dto.category} on ${dto.date.toISOString()}`);
		return result;
	}
}
