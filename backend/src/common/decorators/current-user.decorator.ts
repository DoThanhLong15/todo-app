import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserPayload } from '@modules/user/interfaces/user-payload.interface';

import { RequestWithUser } from '@common/interfaces/request-with-user.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
