import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { ErrorsType } from 'src/common/common.interfaces';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
	override catch(exception: any, host: ArgumentsHost): void {
		if (exception && 'error' in exception.response && 'message' in exception.response && 'statusCode' in exception.response) {
			return super.catch(exception, host);
		}
		const req = host.switchToHttp().getRequest<Request>();
		const res = host.switchToHttp().getResponse<Response>();
		const language = this.getLanguage(req.headers.language);

		res.status(exception.status).json({
			message: exception.response[language],
			error: exception.message.split(' ').slice(0, -1).join(' '),
			statusCode: exception.status
		});
	}

	private getLanguage(header: string | string[] | undefined): keyof ErrorsType['string'] {
		if (!header || Array.isArray(header) || !['ru', 'en'].includes(header)) {
			return 'en';
		}
		return header as keyof ErrorsType['string'];
	}
}
