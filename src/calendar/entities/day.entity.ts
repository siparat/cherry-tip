import { GoalTypeEnum } from '@prisma/client';
import { IDayEntity } from '../calendar.interfaces';
import { UserErrorMessages } from 'src/user/user.constants';
import { GoalEntity } from 'src/user/entities/goal.entity';
import { DayRecipesEntity } from './day-recipes.entity';
import { UnprocessableEntityException } from '@nestjs/common';

export class DayEntity {
	id?: number;
	date: Date;
	goal: GoalTypeEnum;
	needCalories: number;
	protein: number;
	carbs: number;
	fat: number;
	breakfast: number;
	lunch: number;
	dinner: number;
	snack: number;
	userId: string;
	recipes: DayRecipesEntity[];

	constructor(day: IDayEntity) {
		const isInstanceModel = !('user' in day);
		if (!isInstanceModel && !day.user.id) {
			throw new UnprocessableEntityException(UserErrorMessages.ID_IS_MISSING_IN_ENTITY);
		}
		if (!isInstanceModel && !day.user.goal) {
			throw new UnprocessableEntityException(UserErrorMessages.GOAL_IS_REQUIRED);
		}

		const { protein, carbs, fat } = isInstanceModel
			? { protein: day.protein, carbs: day.carbs, fat: day.fat }
			: day.user.calculateMacros();

		this.id;
		this.date = new Date(Date.UTC(day.date.getFullYear(), day.date.getMonth(), day.date.getDate()));
		this.goal = isInstanceModel ? day.goal : (day.user.goal as GoalEntity).type;
		this.needCalories = isInstanceModel ? day.needCalories : (day.user.goal as GoalEntity).calorieGoal;
		this.protein = day.protein ?? protein;
		this.carbs = day.carbs ?? carbs;
		this.fat = day.fat ?? fat;
		this.userId = isInstanceModel ? day.userId : (day.user.id as string);
		this.breakfast = day.breakfast ?? Math.ceil(this.needCalories * 0.3);
		this.lunch = day.lunch ?? Math.ceil(this.needCalories * 0.4);
		this.dinner = day.dinner ?? Math.ceil(this.needCalories * 0.2);
		this.snack = day.snack ?? this.needCalories - (this.breakfast + this.lunch + this.dinner);
	}

	setRecipes(entities: DayRecipesEntity[]): this {
		this.recipes = entities;
		return this;
	}
}
