import { Request } from 'express';
import { UserPayload } from '@modules/user/interfaces/user-payload.interface';

export interface RequestWithUser extends Request {
  user: UserPayload;
}