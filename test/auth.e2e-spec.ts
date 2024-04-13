import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule, Test } from '@nestjs/testing';
import { UserModel } from '@prisma/client';
import { Server } from 'http';
import { AppModule } from 'src/app.module';
import { AuthDtoErrors, AuthErrorMessages } from 'src/auth/auth.constants';
import { AuthLoginDto } from 'src/auth/dto/auth-login.dto';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import * as request from 'supertest';

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
	let token: string;
	let app: NestApplication;
	let server: Server;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();
		app = moduleRef.createNestApplication();
		server = app.getHttpServer();
		app.init();
	});

	describe('/auth/register (POST)', () => {
		it('Is not email (fail)', async () => {
			const res = await request(server)
				.post('/auth/register')
				.send({ ...registerDto, email: 'email' })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(AuthDtoErrors.IS_NOT_EMAIL);
		});

		it('Created (success)', async () => {
			const res = await request(server).post('/auth/register').send(registerDto).expect(HttpStatus.CREATED);
			const body: UserModel = await res.body;
			userId = body.id;
			expect(body.email).toBe(registerDto.email);
		});

		it('Already exist (fail)', async () => {
			return request(server).post('/auth/register').send(registerDto).expect(HttpStatus.CONFLICT);
		});
	});

	describe('/auth/login (POST)', () => {
		it('Is not email (fail)', async () => {
			const res = await request(server)
				.post('/auth/login')
				.send({ ...loginDto, email: 'email' })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message[0]).toBe(AuthDtoErrors.IS_NOT_EMAIL);
		});

		it('Not found (fail)', async () => {
			return request(server)
				.post('/auth/login')
				.send({ ...loginDto, email: `a${loginDto.email}` })
				.expect(HttpStatus.NOT_FOUND);
		});

		it('Wrong password (fail)', async () => {
			const res = await request(server)
				.post('/auth/login')
				.send({ ...loginDto, password: `${loginDto.password}a` })
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toBe(AuthErrorMessages.WRONG_PASSWORD);
		});

		it('Logined (success)', async () => {
			const res = await request(server).post('/auth/login').send(loginDto).expect(HttpStatus.OK);
			expect(res.text).toBeDefined();
			token = res.text;
		});
	});

	afterEach(async () => {
		await app.close();
	});

	afterAll(async () => {
		await app.get(UserRepository).deleteById(userId);
	});
});
