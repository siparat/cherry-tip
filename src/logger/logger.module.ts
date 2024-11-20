import { ConsoleLogger, DynamicModule, Logger } from '@nestjs/common';

export class LoggerModule {
	static forEach(context: string): DynamicModule {
		return {
			module: LoggerModule,
			providers: [{ useValue: new ConsoleLogger(context), provide: Logger }],
			exports: [Logger]
		};
	}
}
