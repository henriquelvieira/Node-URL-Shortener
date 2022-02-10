import { Request, Response, NextFunction } from 'express';
import config, { IConfig } from 'config';
import { StatusCodes } from 'http-status-codes';
import shortid from 'shortid';
import BadRequestError from '../models/errors/badRequest.error.model';
import { IUrl } from '../models/url.model';
// import DatabaseError from "../models/errors/database.error.model";
import logger from '../logger';
import UrlRepository from '../repositories/url.repositorie';

export function generateShortid() {
  try {
    const urlID = shortid.generate() as string;
    return urlID;
  } catch (error) {
    logger.error(`Falha ao gerar o Shortid da URL ${error}`);
    throw new BadRequestError('Falha ao gerar a Shortid', error);
  }
}

export function formatURL(urlID: string): string {
  if (!urlID) {
    throw new BadRequestError('Falha ao formatar a URL de retorno');
  }

  try {
    const configs: IConfig = config.get('App');

    const urlServer = ((configs.get('url_api') as string) +
      configs.get('port')) as string;
    const urlShortened = `${urlServer}/${urlID}`;

    return urlShortened;
  } catch (error) {
    logger.error(`Falha ao formatar a URL ${error}`);
    throw new BadRequestError('Falha ao formatar a URL de retorno', error);
  }
}

export class ShortenerController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      //Pegar o conteudo da requisição
      const urlReq: IUrl = req.body;

      if (!urlReq) {
        throw new BadRequestError('URL não informada na requisição');
      }

      //Validar se a URL foi informada
      if (!urlReq.original) {
        throw new BadRequestError('Campo original não informado no requisição');
      }

      //Verificar se a URL já está na base
      const respository = new UrlRepository();
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
        const respository = new UrlRepository();
        await respository.create(newRecordData);
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

      if (!shortURL) {
        throw new BadRequestError('Short URL não informada na requisição');
      }

      //Busca a URL original no banco de dados
      const respository = new UrlRepository();
      const urlResponseDB: IUrl = await respository.findUrlOriginal(shortURL);

      if (!urlResponseDB) {
        throw new BadRequestError('URL não encontrada na base de dados!'); //TO DO: DESCOMENTAR
      }

      //Montagem do objeto que será retornado na requisição
      const response: IUrl = {
        ...urlResponseDB,
        shortened: shortURL,
      };

      //redirecionar
      return res.status(StatusCodes.OK).send(response); //Descomentar para teste
      // return res.redirect(response.original) //Redirecionar para a URL original
    } catch (error) {
      next(error);
    }
  }
}
