export interface BaseServerResponse<T = unknown> {
  success: boolean;
  message: string;
  responseObject: T;
}
