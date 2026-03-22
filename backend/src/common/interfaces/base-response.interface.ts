export interface BaseResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string | string[];
  path: string;
  timestamp: string;
  data?: T;
}