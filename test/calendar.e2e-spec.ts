import { HttpStatus } from '@nestjs/common';
import { HttpAdapterHost, NestApplication } from '@nestjs/core';
import { TestingModule, Test } from '@nestjs/testing';
import { ActivityEnum, CategoryEnum, DifficultyEnum, GoalTypeEnum, SexEnum } from '@prisma/client';
import { Server } from 'http';
import { AppModule } from 'src/app.module';
import { AuthErrorMessages } from 'src/auth/auth.constants';
import { AuthLoginDto } from 'src/auth/dto/auth-login.dto';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';
import { DatabaseService } from 'src/database/database.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import * as request from 'supertest';
import { CommonDtoErrors } from 'src/common/common.constants';
import { CreateUserUnitsDto } from 'src/user/dto/create-user-units.dto';
import { CreateUserGoalDto } from 'src/user/dto/create-user-goal.dto';
import { CreateUserProfileDto } from 'src/user/dto/create-user-profile.dto';
import { UserErrorMessages } from 'src/user/user.constants';
import { CalendarDtoErrors, CalendarErrorMessages } from 'src/calendar/calendar.constants';
import { SetRecipesDto } from 'src/calendar/dto/set-recipes.dto';
import { CreateRecipeDto } from 'src/recipe/dto/create-recipe.dto';
import { ExceptionFilter } from 'src/filters/exception.filter';

const loginDto: AuthLoginDto = {
	email: 'e@e.ru',
	password: '11223344'
};

const registerDto: AuthRegisterDto = {
	...loginDto,
	login: 'login5'
};

const createProfileDto: CreateUserProfileDto = {
	birth: new Date(2000, 0, 1),
	firstName: 'Иван',
	lastName: null,
	city: null,
	sex: SexEnum.Male
};

const createUnitsDto: CreateUserUnitsDto = {
	height: 180,
	weight: 80,
	targetWeight: 82,
	bloodGlucose: null
};

const createGoalDto: CreateUserGoalDto = {
	activity: ActivityEnum.Medium,
	type: GoalTypeEnum.Lose
};

const createRecipeDto: CreateRecipeDto = {
	title: 'Американский пирог',
	image: 'https://example.com/image.png',
	difficulty: DifficultyEnum.Easy,
	protein: 15.3,
	fat: 2.5,
	carbs: 31.5
};

const setRecipesDto: Omit<SetRecipesDto, 'date'> & { date: string } = {
	category: CategoryEnum.Breakfast,
	date: new Date(2024, 4, 16).toISOString(),
	recipes: []
};

describe('CalendarController (e2e)', () => {
	let userId: string;
	let dayId: number;
	let token: string;
	let app: NestApplication;
	let server: Server;
	let database: DatabaseService;
	let today: string;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();
		app = moduleRef.createNestApplication();
		app.useGlobalFilters(new ExceptionFilter(app.get(HttpAdapterHost).httpAdapter));
		server = app.getHttpServer();
		app.init();
		userId = userId ?? (await request(server).post('/auth/register').send(registerDto)).body.id;
		token = (await request(server).post('/auth/login').send(loginDto)).body.token;
		today = new Date().toISOString().slice(0, 10);
		database = app.get(DatabaseService);
	});

	describe('/calendar/day (GET)', () => {
		it('Unauthorized (fail)', async () => {
			const res = await request(server).get('/calendar/day').expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.en);
		});

		it('Is not date (fail)', async () => {
			const res = await request(server)
				.get('/calendar/day?date=true')
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toBe(CommonDtoErrors.IS_NOT_DATE.en);
		});

		it('Goal is required (fail)', async () => {
			const res = await request(server)
				.get(`/calendar/day?date=${today}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.UNPROCESSABLE_ENTITY);
			expect(res.body.message).toBe(UserErrorMessages.GOAL_IS_REQUIRED.en);
		});

		it('Created (success)', async () => {
			await request(server)
				.post('/user/profile')
				.set('Authorization', 'Bearer ' + token)
				.send(createProfileDto);
			await request(server)
				.post('/user/units')
				.set('Authorization', 'Bearer ' + token)
				.send(createUnitsDto);
			await request(server)
				.post('/user/goal')
				.set('Authorization', 'Bearer ' + token)
				.send(createGoalDto);
			const res = await request(server)
				.get(`/calendar/day?date=${today}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.OK);
			dayId = res.body.id;
			expect(res.body.date.slice(0, 10)).toBe(today);
			expect(res.body.userId).toBe(userId);
		});
	});

	describe('/calendar/day/:id (GET)', () => {
		it('Unauthorized (fail)', async () => {
			const res = await request(server).get(`/calendar/day/${dayId}`).expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.en);
		});

		it('Not found (fail)', async () => {
			const res = await request(server)
				.get('/calendar/day/0')
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toBe(CalendarErrorMessages.DAY_NOT_FOUND.en);
		});

		it('No rights (fail)', async () => {
			const dto = { email: 'email@email.ru', login: 'login', password: 'password' };
			const userId = (await request(server).post('/auth/register').send(dto)).body.id;
			const token = (await request(server).post('/auth/login').send(dto)).body.token;
			const res = await request(server)
				.get(`/calendar/day/${dayId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.FORBIDDEN);
			expect(res.body.message).toBe(CalendarErrorMessages.ANOTHER_DAY.en);
			await database.userModel.delete({ where: { id: userId } });
		});

		it('Setted (success)', async () => {
			const res = await request(server)
				.get(`/calendar/day/${dayId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.OK);
			expect(res.body.id).toBe(dayId);
		});
	});

	describe('/calendar/day/recipes (POST)', () => {
		it('Unauthorized (fail)', async () => {
			const res = await request(server)
				.post(`/calendar/day/recipes`)
				.send(setRecipesDto)
				.expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.en);
		});

		it('Is not date (fail)', async () => {
			const res = await request(server)
				.post('/calendar/day/recipes')
				.send({ ...setRecipesDto, date: undefined })
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(CommonDtoErrors.IS_NOT_DATE.en);
		});

		it('Invalid category (fail)', async () => {
			const res = await request(server)
				.post('/calendar/day/recipes')
				.send({ ...setRecipesDto, category: 'beautiful_category' })
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(CalendarDtoErrors.INVALID_CATEGORY.en);
		});

		it('Is not array (fail)', async () => {
			const res = await request(server)
				.post('/calendar/day/recipes')
				.send({ ...setRecipesDto, recipes: 'soup' })
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(CommonDtoErrors.IS_NOT_ARRAY.en);
		});

		it('Recieved (success)', async () => {
			await database.recipeModel.deleteMany({ where: { title: createRecipeDto.title } });
			const id = (
				await request(server)
					.post('/recipe')
					.send(createRecipeDto)
					.set('Authorization', 'Bearer ' + token)
			).body.id;
			const res = await request(server)
				.post(`/calendar/day/recipes`)
				.send({ ...setRecipesDto, recipes: [id] })
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.OK);
			expect(res.body.recipes.length).toBe(1);
			expect(res.body.recipes[0].recipe.id).toBe(id);
			await database.recipeModel.delete({ where: { id } });
		});
	});

	afterEach(async () => {
		await database.$disconnect();
		await app.close();
	});

	afterAll(async () => {
		await database.dayModel.delete({ where: { id: dayId } });
		await app.get(UserRepository).deleteById(userId);
	});
});
