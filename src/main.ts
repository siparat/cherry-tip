import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger, INestApplication } from '@nestjs/common';
import { ExceptionFilter } from './filters/exception.filter';

async function bootstrap(): Promise<void> {
	const logger = new ConsoleLogger('ExceptionFilter');

	const app = await NestFactory.create<INestApplication>(AppModule);
	app.useGlobalFilters(new ExceptionFilter(app.get(HttpAdapterHost).httpAdapter, logger));
	app.setGlobalPrefix('v1');

	const options = new DocumentBuilder()
		.setTitle('Cherry Tip')
		.setDescription('Документация написанная специально для котляра')
		.setVersion('1')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('docs', app, document);

	await app.listen(3000);
}

bootstrap();
