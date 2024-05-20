import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
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
