import { Request, Response, NextFunction } from "express";
import config from "config";
import {StatusCodes} from 'http-status-codes';
import shortid from "shortid";
import { Url } from "../@types/url.type";
import BadRequestError from "../models/errors/badRequest.error.model";

export function generateShortid() {
    try {
        const urlID = shortid.generate() as string;
        return urlID;        
    } catch (error) {
        throw new BadRequestError('Falha ao gerar a Shortid');        
    }    
};

export class ShortenerController {

    public async create (req: Request, res: Response, next: NextFunction) {

        try {
            //Pegar o conteudo da requisição
            const url: Url = req.body;
    
            if (!url.url_original){
                throw new BadRequestError('campo url_original não informado no requisição');
            }

            //Verificar se a URL já está na base

            //Encurtar a URL       
            const urlID = generateShortid();
    
            //Montagem da URL do Server
            const urlServer = config.get('App.url_api') as string + config.get('App.port') as string;
            const urlShortened = `${urlServer}/${urlID}`;
    
            //Gravar a URL na base
    
            //Retornar
            const response: Url = {url_original: url.url_original,
                                   url_shortened: urlShortened,
                                   id: urlID};
    
            return res.status(StatusCodes.OK).send(response); //Responder a requisição c/ o Status 200
            
            
        } catch (error) {
            next(error);            
        }
    }

    public async redirect (req: Request<{ shortURL: string }>, res: Response, next: NextFunction) {

        try {
            const shortURL = req.params.shortURL;
    
            //Descobrir a URL completa no banco
            const urlOriginal = "http://www.dba-oracle.com/t_calling_oracle_function.htm";
    
    
            const response: Url = {url_original: urlOriginal,
                                   url_shortened: shortURL,
                                   id: shortURL};                             
    
            //redirecionar 
            return res.status(StatusCodes.OK).send(response); 
            // return res.redirect(response.url_original)
        } catch (error) {
            next(error);            
        }
    }
};
