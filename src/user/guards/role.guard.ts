import { CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { RoleEnum, UserModel } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserErrorMessages } from '../user.constants';

export class RoleGuard implements CanActivate {
	constructor(private role: RoleEnum) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const user = context.switchToHttp().getRequest<Request>().user as UserModel | undefined;
		if (!user) {
			throw new NotFoundException(UserErrorMessages.NOT_FOUND);
		}
		if (this.role == RoleEnum.Admin && user.role !== RoleEnum.Admin) {
			throw new ForbiddenException(UserErrorMessages.FORBIDDEN_ROLE);
		}
		return true;
	}
}
