export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  path: string;
  timestamp: string;
  data?: T;
}