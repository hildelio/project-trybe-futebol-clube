import { NextFunction, Request, Response } from 'express';
import { responseWithMessage } from '../utils/handleResponse';
import CustomError from '../utils/CustomError';
import httpStatus from '../utils/httpStatus';

function handleError(err: Error, req: Request, res: Response, next: NextFunction): void | Response {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof CustomError) {
    return responseWithMessage(res, {
      type: err.statusCode,
      message: err.message,
      data: { value: null },
    });
  }

  return responseWithMessage(res, {
    type: httpStatus.internalServerError,
    message: 'Internal Server Error',
    data: { value: null },
  });
}

export default handleError;
