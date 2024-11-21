import { ConsoleLogger, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost, NestApplication } from '@nestjs/core';
import { TestingModule, Test } from '@nestjs/testing';
import { DifficultyEnum } from '@prisma/client';
import { Server } from 'http';
import { AuthErrorMessages } from 'src/auth/auth.constants';
import { AuthLoginDto } from 'src/auth/dto/auth-login.dto';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';
import { DatabaseService } from 'src/database/database.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import * as request from 'supertest';
import { CreateRecipeDto } from 'src/recipe/dto/create-recipe.dto';
import { RecipeErrorMessages } from 'src/recipe/recipe.constants';
import { ExceptionFilter } from 'src/filters/exception.filter';
import { TestAppModule } from './test-app.module';

const loginDto: AuthLoginDto = {
	email: 'c@c.ru',
	password: '11223344'
};

const registerDto: AuthRegisterDto = {
	...loginDto,
	login: 'login3'
};

const createRecipeDto: CreateRecipeDto = {
	title: 'Рулет с джемом',
	image: 'https://example.com/image.png',
	difficulty: DifficultyEnum.Easy,
	protein: 15.3,
	fat: 2.5,
	carbs: 31.5
};

describe('RecipeController (e2e)', () => {
	let userId: string;
	let recipeId: number;
	let token: string;
	let app: NestApplication;
	let server: Server;
	let database: DatabaseService;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			imports: [TestAppModule]
		}).compile();
		app = moduleRef.createNestApplication();
		const logger = new ConsoleLogger('ExceptionFilter');
		app.useGlobalFilters(new ExceptionFilter(app.get(HttpAdapterHost).httpAdapter, logger));
		server = app.getHttpServer();
		app.init();
		userId = userId ?? (await request(server).post('/auth/register').send(registerDto)).body.id;
		token = (await request(server).post('/auth/login').send(loginDto)).body.token;
		database = app.get(DatabaseService);
	});

	describe('/recipe (POST)', () => {
		it('Unauthorized (fail)', async () => {
			const res = await request(server).post('/recipe').set('Language', 'ru').expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.ru);
		});

		it('Tag not found (fail)', async () => {
			const res = await request(server)
				.post('/recipe')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createRecipeDto, categoryId: -1 })
				.expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toBe(RecipeErrorMessages.TAG_NOT_FOUND.ru);
		});

		it('Created (success)', async () => {
			const res = await request(server)
				.post('/recipe')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createRecipeDto)
				.expect(HttpStatus.CREATED);
			recipeId = res.body.id;
			expect(res.body.title).toBe(createRecipeDto.title);
		});

		it('Already exist with this name (fail)', async () => {
			const res = await request(server)
				.post('/recipe')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createRecipeDto)
				.expect(HttpStatus.CONFLICT);
			expect(res.body.message).toBe(RecipeErrorMessages.ALREADY_EXIST_WITH_THIS_NAME.ru);
		});
	});

	describe('/recipe/:id (GET)', () => {
		it('Not found (fail)', async () => {
			const res = await request(server).get('/recipe/-1').set('Language', 'ru').expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toBe(RecipeErrorMessages.NOT_FOUND.ru);
		});

		it('Received (success)', async () => {
			const res = await request(server)
				.get(`/recipe/${recipeId}`)
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.OK);
			expect(res.body.title).toBe(createRecipeDto.title);
		});
	});

	describe('/recipe/:id (PUT)', () => {
		it('Unauthorized (fail)', async () => {
			const res = await request(server)
				.put(`/recipe/${recipeId}`)
				.set('Language', 'ru')
				.expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.ru);
		});

		it('Not found (fail)', async () => {
			const res = await request(server)
				.put(`/recipe/-1`)
				.send(createRecipeDto)
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toBe(RecipeErrorMessages.NOT_FOUND.ru);
		});

		it('Tag not found (fail)', async () => {
			const res = await request(server)
				.put(`/recipe/${recipeId}`)
				.send({ ...createRecipeDto, categoryId: -1 })
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toBe(RecipeErrorMessages.TAG_NOT_FOUND.ru);
		});

		it('Titles match (fail)', async () => {
			const title = 'Вишневый пирог';

			const id = (
				await request(server)
					.post('/recipe')
					.set('Authorization', 'Bearer ' + token)
					.set('Language', 'ru')
					.send({ ...createRecipeDto, title })
			).body.id;

			const res = await request(server)
				.put(`/recipe/${recipeId}`)
				.send({ ...createRecipeDto, title })
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.CONFLICT);

			await database.recipeModel.delete({ where: { id } });

			expect(res.body.message).toBe(RecipeErrorMessages.ALREADY_EXIST_WITH_THIS_NAME.ru);
		});

		it('Edited (success)', async () => {
			const res = await request(server)
				.put(`/recipe/${recipeId}`)
				.send({ ...createRecipeDto, title: 'Вишневый пирог' })
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.OK);
			expect(res.body.id).toBe(recipeId);
		});
	});

	describe('/recipe/:id (DELETE)', () => {
		it('Unauthorized (fail)', async () => {
			const res = await request(server)
				.delete(`/recipe/${recipeId}`)
				.set('Language', 'ru')
				.expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.ru);
		});

		it('Not found (fail)', async () => {
			const res = await request(server)
				.delete(`/recipe/-1`)
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toBe(RecipeErrorMessages.NOT_FOUND.ru);
		});

		it('Deleted (success)', async () => {
			const res = await request(server)
				.delete(`/recipe/${recipeId}`)
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.OK);
			expect(res.body.id).toBe(recipeId);
		});
	});

	afterEach(async () => {
		await database.$disconnect();
		await app.close();
	});

	afterAll(async () => {
		await app.get(UserRepository).deleteById(userId);
	});
});
