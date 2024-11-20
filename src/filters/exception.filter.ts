/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, Catch, ConsoleLogger } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { ErrorsType } from 'src/common/common.interfaces';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
	constructor(
		appRef: AbstractHttpAdapter,
		private logger: ConsoleLogger
	) {
		super(appRef);
	}

	override catch(exception: any, host: ArgumentsHost): void {
		try {
			if (
				exception &&
				'error' in exception.response &&
				'message' in exception.response &&
				'statusCode' in exception.response
			) {
				return super.catch(exception, host);
			}
			const req = host.switchToHttp().getRequest<Request>();
			const res = host.switchToHttp().getResponse<Response>();
			const language = this.getLanguage(req.headers.language);

			this.logger.error(`[${exception.status}] ${exception.response[language]}`);
			res.status(exception.status).json({
				message: exception.response[language],
				error: exception.message.split(' ').slice(0, -1).join(' '),
				statusCode: exception.status
			});
		} catch (error) {
			super.catch(exception, host);
		}
	}

	private getLanguage(header: string | string[] | undefined): keyof ErrorsType['string'] {
		if (!header || Array.isArray(header) || !['ru', 'en'].includes(header)) {
			return 'en';
		}
		return header as keyof ErrorsType['string'];
	}
}
