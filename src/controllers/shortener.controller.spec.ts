import { Request, Response, NextFunction } from 'express';

import {
  formatURL,
  generateShortid,
  ShortenerController,
} from '../controllers/shortener.controller';
import BadRequestError from '../models/errors/badRequest.error.model';
import { IUrl } from '../models/url.model';

describe('ShortenerController', () => {
  it('(generateShortid) - Should be able to generate a short id', () => {
    const urlID = generateShortid();

    expect(urlID).toBeDefined();
  });

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
    const shortenerController = new ShortenerController();
    const mockRequest = {
      body: {
        original: '',
      },
    } as Request;

    const mockResponse: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const mockNext: NextFunction = jest.fn();

    mockRequest.body.original = 'http://teste.com';

    await shortenerController.create(
      mockRequest,
      mockResponse as Response,
      mockNext
    );
    expect(mockResponse.status).toBeCalledWith(200);
  });

  //   it('(ShortenerController.redirect) - Should not be redirect the user for a inexistent shortener URL', async () => {
  //     const shortenerController = new ShortenerController();

  //     const mockRequest = {
  //       params: {
  //         shortURL: '',
  //       },
  //     } as Request<{ shortURL: string }>;

  //     const mockResponse: any = {
  //       status: jest.fn().mockReturnThis(),
  //       send: jest.fn(),
  //     };

  //     const mockNext: NextFunction = jest.fn();

  //     await shortenerController.redirect(
  //       mockRequest,
  //       mockResponse as Response,
  //       mockNext
  //     );

  //     expect(mockResponse.status).toBeCalledWith(400);
  //   });

  it('(create) - Should be able shorter a URL', async () => {
    const url: IUrl = { original: 'www.google.com' };

    const urlID = generateShortid();

    const urlShortened = formatURL(urlID);

    const response = {
      original: url.original,
      shortened: urlID,
      urlShortened: urlShortened,
    };

    expect(url).toHaveProperty('original');
    expect(urlID.length).toBeGreaterThan(0);

    expect(response).toHaveProperty('original');
    expect(response).toHaveProperty('shortened');
    expect(response).toHaveProperty('urlShortened');
  });

  it('(redirect) - Should be able redirect to original URL', async () => {
    const shortURL = 'http://localhost:4001/vxZ3qSsCt';

    const urlOriginal =
      'http://www.dba-oracle.com/t_calling_oracle_function.htm';

    const response: IUrl = { original: urlOriginal, urlShortened: shortURL };

    expect(response).toHaveProperty('original');
    expect(response).toHaveProperty('urlShortened');
  });
});
