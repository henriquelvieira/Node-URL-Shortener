import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import shortid from 'shortid';

import StaticStringKeys from '../common/constants';
import logger from '../logger';
import BadRequestError from '../models/errors/badRequest.error.model';
import { IUrl } from '../models/url.model';
import UrlRepository, { IUrlRepository } from '../repositories/url.repositorie';
import Configs from '../util/configs';
import Env from '../util/env';

export function generateShortid() {
  const urlID = shortid.generate();
  return urlID;
}

export function formatURL(urlID: string): string {
  try {
    if (!urlID || urlID.length === 0) {
      throw new BadRequestError(StaticStringKeys.FAIL_FORMAT_URL);
    }
    const configs = Configs.get('App');
    const ApiUrl = configs.get('urlApi') as string;
    // const ApiPort = Number(Env.get(configs.get('envs.APP.Port')));

    // const urlServer = ApiUrl + ApiPort;
    const urlServer = ApiUrl;
    const urlShortened = `${urlServer}/${urlID}`;

    return urlShortened;
  } catch (error) {
    logger.error(`${StaticStringKeys.FAIL_FORMAT_URL} ${error}`);
    throw new BadRequestError(StaticStringKeys.FAIL_FORMAT_URL);
  }
}

export class ShortenerController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      //Pegar o conteudo da requisição
      const urlReq: IUrl = req.body;

      //Validar se a URL foi informada
      if (!urlReq || !urlReq.original) {
        throw new BadRequestError(StaticStringKeys.UNKNOWN_URL);
      }

      //Verificar se a URL já está na base
      const respository: IUrlRepository = new UrlRepository();
      const urlResponseDB: IUrl = await respository.findUrlShortened(urlReq);

      let urlID: string;
      let newRegister = false;

      //Gerar novo Shortid ou retornar do banco caso já exista
      if (urlResponseDB.shortened) {
        urlID = urlResponseDB.shortened as string; //Recuperar a Short URL que está no banco
      } else {
        urlID = generateShortid(); //Gerar o ID para a Short URL
        newRegister = true;
      }

      //Montagem do objeto que será salva no banco
      const newRecordData: IUrl = {
        original: urlReq.original,
        shortened: urlID,
      };

      //Gravar a URL na base
      if (newRegister) {
        const repository = new UrlRepository();
        await repository.create(newRecordData);
      }

      //Montagem da URL do Server
      const urlShortened = formatURL(urlID);

      //Montagem do objeto que será retornado na requisição
      const response: IUrl = {
        ...newRecordData,
        urlShortened: urlShortened,
      };

      return res.status(StatusCodes.OK).send(response); //Responder a requisição c/ o Status 200
    } catch (error) {
      next(error);
    }
  }

  public async redirect(
    req: Request<{ shortURL: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const shortURL = req.params.shortURL;

      if (!shortURL || shortURL.length === 0) {
        throw new BadRequestError(StaticStringKeys.UNKNOWN_URL);
      }

      //Busca a URL original no banco de dados
      const repository: IUrlRepository = new UrlRepository();
      const urlResponseDB: IUrl = await repository.findUrlOriginal(shortURL);

      if (!urlResponseDB || !urlResponseDB.shortened) {
        throw new BadRequestError(StaticStringKeys.FAIL_FIND_URL); //TO DO: DESCOMENTAR
      }

      //Montagem do objeto que será retornado na requisição
      const response: IUrl = {
        original: urlResponseDB.original,
        shortened: shortURL,
      };

      //redirecionar
      //   return res.status(StatusCodes.OK).send(response); //Descomentar para teste
      return res.redirect(response.original); //Redirecionar para a URL original
    } catch (error) {
      next(error);
    }
  }
}
