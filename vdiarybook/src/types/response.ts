export interface FieldError {
  type: string;
  value: any;
  msg: string;
  path: string;
  location: string
};

export type SuccessResponse<T> = {
  message: string;
  result: T;
  metadata: T;
  statusCode: number;
  reasonStatusCode: string;
};

export type ErrorResponse = {
  message: string;
  statusCode: number;
  status: string;
  errors?: Record<string, FieldError>;
};

export type authResponse = SuccessResponse<{
  user: {
    _id: string;
    username: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}>;
