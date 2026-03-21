import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserPayload } from '@modules/auth/interfaces/user-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<UserPayload>();

    return data ? user?.[data] : user;
  },
);
