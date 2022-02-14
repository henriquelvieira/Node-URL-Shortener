import { Request, Response, NextFunction } from 'express';

import {
  formatURL,
  ShortenerController,
} from '../controllers/shortener.controller';
import BadRequestError from '../models/errors/badRequest.error.model';

// export const interceptor = {
//   mockRequest: () => {
//     const req: any = {};
//     req.body = jest.fn().mockReturnValue(req);
//     req.params = jest.fn().mockReturnValue(req);
//     req.app = jest.fn().mockReturnValue(req);
//     req.app.get = jest.fn().mockReturnValue(req);
//     return req;
//   },
//   mockResponse: () => {
//     const res: any = {};
//     res.send = jest.fn().mockReturnValue(res);
//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     res.locals = jest.fn().mockReturnValue(res);
//     return res;
//   },
//   mockNext: () => jest.fn(),
// };

// const mockResponse = () => {
//   const res: any = {};
//   res.status = jest.fn().mockReturnValue(res);
//   res.json = jest.fn().mockReturnValue(res);
//   return res;
// };
// const response: Response = mockResponse();

describe('ShortenerController', () => {
  const shortenerController = new ShortenerController();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  const mockRequest = {
    body: {
      original: '',
    },
  } as Request;

  const mockNext: NextFunction = jest.fn();

  it('(formatURL) - Should not be able to format a url', async () => {
    try {
      formatURL('');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error).toHaveProperty(
        'message',
        'Falha ao formatar a URL de retorno'
      );
    }
  });

  it('(ShortenerController.create) - Should be generate a new Short URL', async () => {
    mockRequest.body.original = 'http://teste.com';

    await shortenerController.create(
      mockRequest,
      mockResponse as Response,
      mockNext
    );
    expect(mockResponse.status).toBeCalledWith(200);
  });

  it('(ShortenerController.create) - Should be retrieve an already shortened URL', async () => {
    mockRequest.body.original =
      'http://www.dba-oracle.com/t_calling_oracle_function.htm';

    await shortenerController.create(
      mockRequest,
      mockResponse as Response,
      mockNext
    );
    expect(mockResponse.status).toBeCalledWith(200);
  });

  it('(ShortenerController.redirect) - Should not redirect the user without a parameter', async () => {
    const mockRequest = {
      params: { shortURL: '' },
    } as Request<{ shortURL: string }>;

    await shortenerController.redirect(mockRequest, mockResponse, mockNext);

    expect(mockNext).toBeCalled();
    expect(mockResponse.status).not.toBeCalled();
  });

  it('(ShortenerController.redirect) - Should not be redirect the user for a inexistent shortener URL', async () => {
    const mockRequest = {
      params: { shortURL: 'teste' },
    } as Request<{ shortURL: string }>;

    await shortenerController.redirect(mockRequest, mockResponse, mockNext);

    expect(mockNext).toBeCalled();
    expect(mockResponse.status).not.toBeCalled();
  });
});
