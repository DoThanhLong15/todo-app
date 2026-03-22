import { UserPayload } from "@modules/user/interfaces/user-payload.interface";

export interface RefreshTokenPayload extends UserPayload{
  refreshToken: string;
}