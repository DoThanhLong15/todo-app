export interface BaseResponse<T = any> {
  data?: T;
  message: string | string[];
  path?: string;
  timestamp?: string;
  statusCode: number;
  success?: boolean;
}
