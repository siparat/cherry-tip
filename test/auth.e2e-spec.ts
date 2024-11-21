import { ConsoleLogger, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost, NestApplication } from '@nestjs/core';
import { TestingModule, Test } from '@nestjs/testing';
import { UserModel } from '@prisma/client';
import { Server } from 'http';
import { AuthErrorMessages } from 'src/auth/auth.constants';
import { AuthLoginDto } from 'src/auth/dto/auth-login.dto';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';
import { CommonDtoErrors } from 'src/common/common.constants';
import { DatabaseService } from 'src/database/database.service';
import { ExceptionFilter } from 'src/filters/exception.filter';
import { UserRepository } from 'src/user/repositories/user.repository';
import * as request from 'supertest';
import { TestAppModule } from './test-app.module';

const loginDto: AuthLoginDto = {
	email: 'a@a.ru',
	password: '11223344'
};

const registerDto: AuthRegisterDto = {
	...loginDto,
	login: 'login'
};

describe('AuthController (e2e)', () => {
	let userId: string;
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
	});

	describe('/auth/register (POST)', () => {
		it('Is not email (fail)', async () => {
			const res = await request(server)
				.post('/auth/register')
				.set('Language', 'ru')
				.send({ ...registerDto, email: 'email' })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(CommonDtoErrors.IS_NOT_EMAIL.ru);
		});

		it('Created (success)', async () => {
			const res = await request(server)
				.post('/auth/register')
				.set('Language', 'ru')
				.send(registerDto)
				.expect(HttpStatus.CREATED);
			const body: UserModel = await res.body;
			userId = body.id;
			expect(body.email).toBe(registerDto.email);
		});

		it('Already exist (fail)', async () => {
			const res = await request(server)
				.post('/auth/register')
				.set('Language', 'ru')
				.send(registerDto)
				.expect(HttpStatus.CONFLICT);
			expect(res.body.message).toBe(AuthErrorMessages.ALREADY_EXIST.ru);
		});
	});

	describe('/auth/login (POST)', () => {
		it('Is not email (fail)', async () => {
			const res = await request(server)
				.post('/auth/login')
				.set('Language', 'ru')
				.send({ ...loginDto, email: 'email' })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(CommonDtoErrors.IS_NOT_EMAIL.ru);
		});

		it('Not found (fail)', async () => {
			const res = await request(server)
				.post('/auth/login')
				.set('Language', 'ru')
				.send({ ...loginDto, email: `a${loginDto.email}` })
				.expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toBe(AuthErrorMessages.NOT_FOUND.ru);
		});

		it('Wrong password (fail)', async () => {
			const res = await request(server)
				.post('/auth/login')
				.set('Language', 'ru')
				.send({ ...loginDto, password: `${loginDto.password}a` })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toBe(AuthErrorMessages.WRONG_PASSWORD.ru);
		});

		it('Logined (success)', async () => {
			const res = await request(server).post('/auth/login').set('Language', 'ru').send(loginDto).expect(HttpStatus.OK);
			expect(res.text).toBeDefined();
		});
	});

	afterEach(async () => {
		await app.get(DatabaseService).$disconnect();
		await app.close();
	});

	afterAll(async () => {
		await app.get(UserRepository).deleteById(userId);
	});
});
