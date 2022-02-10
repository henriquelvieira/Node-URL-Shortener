import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../logger';
import BadRequestError from '../models/errors/badRequest.error.model';
import DatabaseError from '../models/errors/database.error.model';
import ForbiddenError from '../models/errors/forbidden.error.model';

function errorHandlerMiddleware(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const errorMessage: string = error.message || 'unexpected-error';
  let errorCode = StatusCodes.INTERNAL_SERVER_ERROR;

  if (error instanceof DatabaseError) {
    errorCode = StatusCodes.BAD_REQUEST;
  } else if (error instanceof ForbiddenError) {
    errorCode = StatusCodes.FORBIDDEN;
  } else if (error instanceof BadRequestError) {
    errorCode = StatusCodes.BAD_REQUEST;
  } else {
    logger.error(error);
  }

  res.status(errorCode).json({ errorMessage });
}

export default errorHandlerMiddleware;
