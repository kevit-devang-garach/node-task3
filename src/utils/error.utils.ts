function getErrorFromCode(statusCode: number) {
  switch (statusCode) {
    case 500: {
      return 'DATABASE_ERROR';
    }
    case 400: {
      return 'BAD_REQUEST';
    }
    case 401: {
      return 'FAILED_DEPENDENCY';
    }
    case 424: {
      return 'FAILED_DEPENDENCY';
    }
    default:
      return 'UNHANDLED_ERROR';
  }
}

export default class HttpException extends Error {
  statusCode: number;

  error: string;

  errorCode: string;

  message: string;

  originalError: string;

  meta: string;

  constructor(statusCode: number, message: string, errorCode: string, err: any, meta: any) {
    super(message);
    this.statusCode = statusCode;
    this.error = getErrorFromCode(statusCode) as string;
    this.errorCode = errorCode;
    this.message = message;
    this.originalError = err;
    this.meta = meta;
  }
}
