import { UserPayload } from "@modules/auth/interfaces/user-payload.interface";

export interface UserWithRefreshToken extends UserPayload {
  refreshToken: string;
}