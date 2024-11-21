import { ConsoleLogger, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost, NestApplication } from '@nestjs/core';
import { TestingModule, Test } from '@nestjs/testing';
import { ActivityEnum, GoalTypeEnum, SexEnum } from '@prisma/client';
import { Server } from 'http';
import { AuthErrorMessages } from 'src/auth/auth.constants';
import { AuthLoginDto } from 'src/auth/dto/auth-login.dto';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserProfileDto } from 'src/user/dto/create-user-profile.dto';
import { CreateUserUnitsDto } from 'src/user/dto/create-user-units.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserDtoErrors, UserErrorMessages } from 'src/user/user.constants';
import { CommonDtoErrors } from 'src/common/common.constants';
import * as request from 'supertest';
import { CreateUserGoalDto } from 'src/user/dto/create-user-goal.dto';
import { ExceptionFilter } from 'src/filters/exception.filter';
import { TestAppModule } from './test-app.module';

const loginDto: AuthLoginDto = {
	email: 'b@b.ru',
	password: '11223344'
};

const registerDto: AuthRegisterDto = {
	...loginDto,
	login: 'login2'
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

describe('UserController (e2e)', () => {
	let userId: string;
	let token: string;
	let app: NestApplication;
	let server: Server;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			imports: [TestAppModule]
		}).compile();
		app = moduleRef.createNestApplication();
		const logger = new ConsoleLogger('ExceptionFilter');
		app.useGlobalFilters(new ExceptionFilter(app.get(HttpAdapterHost).httpAdapter, logger));
		server = app.getHttpServer();
		app.init();
		userId = (await request(server).post('/auth/register').send(registerDto)).body.id;
		token = (await request(server).post('/auth/login').send(loginDto)).body.token;
	});

	describe('/user/account (GET)', () => {
		it('Unauthorized (fail)', async () => {
			const res = await request(server).get('/user/account').set('Language', 'ru').expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.ru);
		});

		it('Ok (success)', async () => {
			const res = await request(server)
				.get('/user/account')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.set('Language', 'ru')
				.expect(HttpStatus.OK);
			expect(res.body.id).toBe(userId);
		});
	});

	describe('/user/profile (POST)', () => {
		it('Wrong date (fail)', async () => {
			const res = await request(server)
				.post('/user/profile')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createProfileDto, birth: new Date(1899, 0, 1) })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(UserDtoErrors.MIN_DATE_BIRTH.ru);
		});

		it('Is not date (fail)', async () => {
			const res = await request(server)
				.post('/user/profile')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createProfileDto, birth: '' })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(CommonDtoErrors.IS_NOT_DATE.ru);
		});

		it('Is not string (fail)', async () => {
			const res = await request(server)
				.post('/user/profile')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createProfileDto, firstName: true })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(CommonDtoErrors.IS_NOT_STRING.ru);
		});

		it('Long name (fail)', async () => {
			const res = await request(server)
				.post('/user/profile')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createProfileDto, firstName: 'a'.repeat(21) })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(UserDtoErrors.MAX_LENGTH_NAME.ru);
		});

		it('Long cityname (fail)', async () => {
			const res = await request(server)
				.post('/user/profile')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createProfileDto, city: 'a'.repeat(21) })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(UserDtoErrors.MAX_LENGTH_CITYNAME.ru);
		});

		it('Invalid sex (fail)', async () => {
			const res = await request(server)
				.post('/user/profile')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createProfileDto, sex: 'Bisexual' })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(UserDtoErrors.INVALID_SEX.ru);
		});

		it('Unauthorized (fail)', async () => {
			const res = await request(server)
				.post('/user/profile')
				.set('Language', 'ru')
				.send(createProfileDto)
				.expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.ru);
		});

		it('Created (seccess)', async () => {
			const res = await request(server)
				.post('/user/profile')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createProfileDto)
				.expect(HttpStatus.CREATED);
			expect(res.body.firstName).toBe(createProfileDto.firstName);
		});
	});

	describe('/user/units (POST)', () => {
		it('Is not int (fail)', async () => {
			const res = await request(server)
				.post('/user/units')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createUnitsDto, height: '' })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(CommonDtoErrors.IS_NOT_INT.ru);
		});

		it('Invalid height (fail)', async () => {
			const res = await request(server)
				.post('/user/units')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createUnitsDto, height: -10 })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(UserDtoErrors.INVALID_HEIGHT.ru);
		});

		it('Invalid weight (fail)', async () => {
			const res = await request(server)
				.post('/user/units')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createProfileDto, weight: 500 })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(UserDtoErrors.INVALID_WEIGHT.ru);
		});

		it('Invalid blood glucose (fail)', async () => {
			const res = await request(server)
				.post('/user/units')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createUnitsDto, bloodGlucose: -100 })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(UserDtoErrors.INVALID_BLOOD_GLUCOSE.ru);
		});

		it('Unauthorized (fail)', async () => {
			const res = await request(server)
				.post('/user/units')
				.set('Language', 'ru')
				.send(createUnitsDto)
				.expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.ru);
		});

		it('Already exist (fail)', async () => {
			await request(server)
				.post('/user/units')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createUnitsDto);
			const res = await request(server)
				.post('/user/units')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createUnitsDto)
				.expect(HttpStatus.CONFLICT);
			expect(res.body.message).toBe(UserErrorMessages.UNITS_MODEL_ALREADY_EXIST.ru);
		});

		it('Created (seccess)', async () => {
			const res = await request(server)
				.post('/user/units')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createUnitsDto)
				.expect(HttpStatus.CREATED);
			expect(res.body.height).toBe(createUnitsDto.height);
		});
	});

	describe('/user/goal (POST)', () => {
		it('Invalid type', async () => {
			const res = await request(server)
				.post('/user/goal')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createGoalDto, type: 0 })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(UserDtoErrors.INVALID_GOAL_TYPE.ru);
		});

		it('Invalid activity', async () => {
			const res = await request(server)
				.post('/user/goal')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send({ ...createGoalDto, activity: 0 })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(UserDtoErrors.INVALID_GOAL_ACTIVITY.ru);
		});

		it('Unauthorized (fail)', async () => {
			const res = await request(server)
				.post('/user/goal')
				.set('Language', 'ru')
				.send(createGoalDto)
				.expect(HttpStatus.UNAUTHORIZED);
			expect(res.body.message).toBe(AuthErrorMessages.UNAUTHORIZED.ru);
		});

		it('Profile is required (fail)', async () => {
			await request(server)
				.post('/user/units')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createUnitsDto);
			const res = await request(server)
				.post('/user/goal')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createGoalDto)
				.expect(HttpStatus.UNPROCESSABLE_ENTITY);
			expect(res.body.message).toBe(UserErrorMessages.PROFILE_IS_REQUIRED.ru);
		});

		it('Units is required (fail)', async () => {
			await request(server)
				.post('/user/profile')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createProfileDto);
			const res = await request(server)
				.post('/user/goal')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createGoalDto)
				.expect(HttpStatus.UNPROCESSABLE_ENTITY);
			expect(res.body.message).toBe(UserErrorMessages.UNITS_IS_REQUIRED.ru);
		});

		it('Already exist (fail)', async () => {
			await request(server)
				.post('/user/units')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createUnitsDto);
			await request(server)
				.post('/user/profile')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createProfileDto);
			await request(server)
				.post('/user/goal')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createGoalDto);
			const res = await request(server)
				.post('/user/goal')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createGoalDto)
				.expect(HttpStatus.CONFLICT);
			expect(res.body.message).toBe(UserErrorMessages.GOAL_ALREADY_EXIST.ru);
		});

		it('Created (seccess)', async () => {
			await request(server)
				.post('/user/units')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createUnitsDto);
			await request(server)
				.post('/user/profile')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createProfileDto);
			const res = await request(server)
				.post('/user/goal')
				.set('Authorization', 'Bearer ' + token)
				.set('Language', 'ru')
				.send(createGoalDto)
				.expect(HttpStatus.CREATED);
			expect(res.body.type).toBe(createGoalDto.type);
		});
	});

	afterEach(async () => {
		await app.get(UserRepository).deleteById(userId);
		await app.get(DatabaseService).$disconnect();
		await app.close();
	});
});
