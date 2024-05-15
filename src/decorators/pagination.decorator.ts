import { BadRequestException, ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { CommonErrorMessages } from 'src/common/common.constants';
import { IPaginationParams } from 'src/common/common.interfaces';

export const Pagination = createParamDecorator((require: boolean = false, ctx: ExecutionContext): IPaginationParams => {
	const queries = ctx.switchToHttp().getRequest<Request>();
	const take = Number(queries.query.take);
	const skip = Number(queries.query.skip);
	if ((Number.isNaN(take) || Number.isNaN(skip)) && require) {
		throw new BadRequestException(CommonErrorMessages.INCORRECT_PAGINATION_PARAMS);
	}
	return {
		take: take || undefined,
		skip: skip || undefined
	};
});
