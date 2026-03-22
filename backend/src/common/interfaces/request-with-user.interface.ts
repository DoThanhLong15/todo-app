import { Request } from 'express';
import { UserPayload } from '@modules/auth/interfaces/user-payload.interface';

export interface RequestWithUser extends Request {
  user: UserPayload;
}