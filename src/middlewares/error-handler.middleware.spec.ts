import { Request, NextFunction } from 'express';

import errorHandlerMiddleware from '../middlewares/error-handler.middleware';
import BadRequestError from '../models/errors/badRequest.error.model';
import DatabaseError from '../models/errors/database.error.model';
import ForbiddenError from '../models/errors/forbidden.error.model';

describe('errorHandlerMiddleware', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRequest = {
    body: {},
  } as Request;

  const mockNext: NextFunction = jest.fn();

  it('(formatURL) - Should not be able to format a url', async () => {
    let erro = new DatabaseError('Teste Error');
    errorHandlerMiddleware(erro, mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toBeCalledWith(400);

    erro = new ForbiddenError('Teste Error');
    errorHandlerMiddleware(erro, mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toBeCalledWith(403);

    erro = new BadRequestError('Teste Error');
    errorHandlerMiddleware(erro, mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toBeCalledWith(400);

    erro = new Error('');
    errorHandlerMiddleware(erro, mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toBeCalledWith(500);
  });
});
