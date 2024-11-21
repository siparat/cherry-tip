import { ConsoleLogger, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost, NestApplication } from '@nestjs/core';
import { TestingModule, Test } from '@nestjs/testing';
import { DifficultyEnum, RoleEnum } from '@prisma/client';
import { Server } from 'http';
import { AuthErrorMessages } from 'src/auth/auth.constants';
import { AuthLoginDto } from 'src/auth/dto/auth-login.dto';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';
import { DatabaseService } from 'src/database/database.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import * as request from 'supertest';
import { CreateChallengeDto } from 'src/challenge/dto/create-challenge.dto';
import { ChallengeDtoErrors, ChallengeErrorMessages } from 'src/challenge/challenge.constants';
import { CommonDtoErrors } from 'src/common/common.constants';
import { UserErrorMessages } from 'src/user/user.constants';
import { ExceptionFilter } from 'src/filters/exception.filter';
import { TestAppModule } from './test-app.module';

const loginDto: AuthLoginDto = {
	email: 'd@d.ru',
	password: '11223344'
};

const registerDto: AuthRegisterDto = {
	...loginDto,
	login: 'login4'
};

const createChallengeDto: CreateChallengeDto = {
	title: 'Sweet Free',
	description: `Cutting sugar out of your diet is one strategy to lose weight and feel healthier, but it can be a tough transition. Here are eight tips on how to go sugar-free without going crazy, plus ideas on what to eat on a low-sugar or no-sugar diet.`,
	color: '#FFB7CE',
	image: 'https://example.com/image.png',
	durationDays: 7,
	difficulty: DifficultyEnum.Normal,
	tips: [
		'Be prepared for possible disruptions',
		'Clear your house of sweets',
		'Explore sugar alternatives',
		'Get inspired by existing recipes'
	]
};

describe('ChallengeController (e2e)', () => {
	let userId: string;
	let challengeId: number;
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
		await database.userModel.update({ where: { id: userId }, data: { role: RoleEnum.Admin } });
	});

	describe('/challenge (POST)', () => {
		it('Unauthorized (fail)', async () => {
			const res = await request(server).post('/challenge').set('Language', 'ru').expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.ru);
		});

		it('Only admins allowed (fail)', async () => {
			await database.userModel.update({ where: { id: userId }, data: { role: RoleEnum.User } });
			const res = await request(server)
				.post('/challenge')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createChallengeDto)
				.expect(HttpStatus.FORBIDDEN);
			expect(res.body.message).toBe(UserErrorMessages.FORBIDDEN_ROLE.ru);
		});

		it('Title is long (fail)', async () => {
			const res = await request(server)
				.post('/challenge')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createChallengeDto, title: 'a'.repeat(25) })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(ChallengeDtoErrors.MAX_LENGTH_TITLE.ru);
		});

		it('Description is long (fail)', async () => {
			const res = await request(server)
				.post('/challenge')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createChallengeDto, description: 'a'.repeat(501) })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(ChallengeDtoErrors.MAX_LENGTH_DESCRIPTION.ru);
		});

		it('Is not url (fail)', async () => {
			const res = await request(server)
				.post('/challenge')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createChallengeDto, image: 'WW image' })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(CommonDtoErrors.IS_NOT_URL.ru);
		});

		it('Is not hex (fail)', async () => {
			const res = await request(server)
				.post('/challenge')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createChallengeDto, color: 'black' })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(CommonDtoErrors.IS_NOT_HEX.ru);
		});

		it('Incorrect difficulty (fail)', async () => {
			const res = await request(server)
				.post('/challenge')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createChallengeDto, difficulty: 'ok' })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(ChallengeDtoErrors.INCORRECT_DIFFICULT.ru);
		});

		it('Is not array (fail)', async () => {
			const res = await request(server)
				.post('/challenge')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createChallengeDto, tips: 'Clear your house of sweets' })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(CommonDtoErrors.IS_NOT_ARRAY.ru);
		});

		it('Is not string (fail)', async () => {
			const res = await request(server)
				.post('/challenge')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createChallengeDto, tips: [0, 1, 2] })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(CommonDtoErrors.IS_NOT_STRING.ru);
		});

		it('Created (success)', async () => {
			const res = await request(server)
				.post('/challenge')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createChallengeDto)
				.expect(HttpStatus.CREATED);
			challengeId = res.body.id;
			expect(res.body.title).toBe(createChallengeDto.title);
		});

		it('Already exist with this name (fail)', async () => {
			await request(server)
				.post('/challenge')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createChallengeDto);
			const res = await request(server)
				.post('/challenge')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createChallengeDto)
				.expect(HttpStatus.CONFLICT);
			expect(res.body.message).toBe(ChallengeErrorMessages.ALREADY_EXIST_WITH_THIS_NAME.ru);
		});
	});

	describe('/challenge/:id (GET)', () => {
		it('Not found (fail)', async () => {
			const res = await request(server).get('/challenge/-1').set('Language', 'ru').expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toBe(ChallengeErrorMessages.NOT_FOUND.ru);
		});

		it('Received (success)', async () => {
			const res = await request(server).get(`/challenge/${challengeId}`).set('Language', 'ru').expect(HttpStatus.OK);
			expect(res.body.title).toBe(createChallengeDto.title);
		});
	});

	describe('/challenge/:id/start (POST)', () => {
		it('Not found (fail)', async () => {
			const res = await request(server)
				.post('/challenge/-1/start')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toBe(ChallengeErrorMessages.NOT_FOUND.ru);
		});

		it('Unauthorized (fail)', async () => {
			const res = await request(server)
				.post(`/challenge/${challengeId}/start`)
				.set('Language', 'ru')
				.expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.ru);
		});

		it('Started (success)', async () => {
			const res = await request(server)
				.post(`/challenge/${challengeId}/start`)
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.OK);
			expect(res.body.challengeId).toBe(challengeId);
		});

		it('Already started (fail)', async () => {
			const res = await request(server)
				.post(`/challenge/${challengeId}/start`)
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toBe(ChallengeErrorMessages.ALREADY_STARTED.ru);
		});
	});

	describe('/challenge/:id/cancel (POST)', () => {
		it('Not found (fail)', async () => {
			const res = await request(server)
				.post('/challenge/-1/cancel')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toBe(ChallengeErrorMessages.NOT_FOUND.ru);
		});

		it('Unauthorized (fail)', async () => {
			const res = await request(server)
				.post(`/challenge/${challengeId}/cancel`)
				.set('Language', 'ru')
				.expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.ru);
		});

		it('Canceled (success)', async () => {
			const res = await request(server)
				.post(`/challenge/${challengeId}/cancel`)
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.OK);
			expect(res.body.challengeId).toBe(challengeId);
		});

		it('Not started or already canceled (fail)', async () => {
			const res = await request(server)
				.post(`/challenge/${challengeId}/cancel`)
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toBe(ChallengeErrorMessages.ALREADY_CANCELED.ru);
		});
	});

	describe('/challenge/:id/status (GET)', () => {
		it('Not found (fail)', async () => {
			const res = await request(server)
				.get('/challenge/-1/status')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toBe(ChallengeErrorMessages.NOT_FOUND.ru);
		});

		it('Unauthorized (fail)', async () => {
			const res = await request(server)
				.get(`/challenge/${challengeId}/status`)
				.set('Language', 'ru')
				.expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.ru);
		});

		it('Recieved (success)', async () => {
			const res = await request(server)
				.get(`/challenge/${challengeId}/status`)
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.OK);
			expect(res.body.userChallenge).toBeDefined();
		});
	});

	describe('/challenge/:id (PUT)', () => {
		it('Unauthorized (fail)', async () => {
			const res = await request(server)
				.put(`/challenge/${challengeId}`)
				.set('Language', 'ru')
				.expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.ru);
		});

		it('Not found (fail)', async () => {
			const res = await request(server)
				.put(`/challenge/-1`)
				.send(createChallengeDto)
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toBe(ChallengeErrorMessages.NOT_FOUND.ru);
		});

		it('Titles match (fail)', async () => {
			const title = 'Неделя без сладкого';
			const id = (
				await request(server)
					.post('/challenge')
					.set('Authorization', 'Bearer ' + token)
					.set('Language', 'ru')
					.send({ ...createChallengeDto, title })
			).body.id;

			const res = await request(server)
				.put(`/challenge/${challengeId}`)
				.send({ ...createChallengeDto, title })
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.CONFLICT);

			await database.challengeModel.delete({ where: { id } });

			expect(res.body.message).toBe(ChallengeErrorMessages.ALREADY_EXIST_WITH_THIS_NAME.ru);
		});

		it('Edited (success)', async () => {
			const res = await request(server)
				.put(`/challenge/${challengeId}`)
				.send({ ...createChallengeDto, title: 'Неделя без сладкого' })
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.OK);
			expect(res.body.id).toBe(challengeId);
		});
	});

	describe('/challenge/:id (DELETE)', () => {
		it('Unauthorized (fail)', async () => {
			const res = await request(server)
				.delete(`/challenge/${challengeId}`)
				.set('Language', 'ru')
				.expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.ru);
		});

		it('Not found (fail)', async () => {
			const res = await request(server)
				.delete(`/challenge/-1`)
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toBe(ChallengeErrorMessages.NOT_FOUND.ru);
		});

		it('Deleted (success)', async () => {
			const res = await request(server)
				.delete(`/challenge/${challengeId}`)
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.expect(HttpStatus.OK);
			expect(res.body.id).toBe(challengeId);
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
