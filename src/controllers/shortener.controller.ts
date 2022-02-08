import { Request, Response, NextFunction } from "express";
import config, { IConfig } from "config";
import {StatusCodes} from 'http-status-codes';
import shortid from "shortid";
import BadRequestError from "../models/errors/badRequest.error.model";
import { IUrl, Url } from "../models/url.model";
import DatabaseError from "../models/errors/database.error.model";
import logger from "../logger";

export function generateShortid() {
    try {
        const urlID = shortid.generate() as string;
        return urlID;        
    } catch (error) {
        logger.error(`Falha ao gerar o Shortid da URL ${error}`);      
        throw new BadRequestError('Falha ao gerar a Shortid');  
    }    
}

export class ShortenerController {

    public formatURL (urlID: string): string {
        try {
            const configs: IConfig = config.get('App');
    
            const urlServer = configs.get('url_api') as string + configs.get('port') as string;
            const urlShortened = `${urlServer}/${urlID}`;
            
            return urlShortened;            
        } catch (error) {
            logger.error(`Falha ao formatar a URL ${error}`);      
            throw new BadRequestError('Falha ao gerar a Shortid');  
        }
    }

    public async create (req: Request, res: Response, next: NextFunction) {
        
        try {            
            //Pegar o conteudo da requisição
            const urlReq: IUrl = req.body;

            if (!urlReq) {
                throw new BadRequestError('URL não informada na requisição');
            }

            //Validar se a URL foi informada
            if (!urlReq.original) {
                throw new BadRequestError('Campo url_original não informado no requisição');
            }            

            //Verificar se a URL já está na base
            const urlResponseDB = await Url.findOne({ original: urlReq.original });
            // const urlResponseDB = {}; //TO DO: Remover apos ajustar conexão com o banco
            
            let urlID: string; 
            let newRegister = false;
            
            //Gerar novo Shortid ou retornar do banco caso já exista
            if (urlResponseDB) {
                urlID = urlResponseDB.shortened as string; //Recuperar a Short URL que está no banco  
                // urlID = generateShortid(); //TO DO: Remover apos ajustar conexão com o banco
            } else {                
                urlID = generateShortid(); //Gerar o ID para a Short URL 
                newRegister = true;
            }
            
            //Montagem do objeto que será salva no banco
            const newRecord: IUrl = {
                original: urlReq.original,
                shortened: urlID,
            };
            
            //Gravar a URL na base
            if (newRegister) {
                try {
                    const newUrl = new Url(newRecord);
                    await newUrl.save();                
                } catch (error) {
                    throw new DatabaseError('Falha ao gravar a URL no banco!');                
                }
            }
            
            //Montagem da URL do Server            
            const urlShortened = this.formatURL(urlID);

            //Montagem do objeto que será retornado na requisição
            const response: IUrl = {
                ...newRecord,
                url_shortened: urlShortened
            };
    
            return res.status(StatusCodes.OK).send(response); //Responder a requisição c/ o Status 200
        } catch (error) {
            next(error);            
        }
    }

    public async redirect (req: Request<{ shortURL: string }>, res: Response, next: NextFunction) {

        try {
            const shortURL = req.params.shortURL;
            
            if (!shortURL) {
                throw new BadRequestError('Short URL não informada na requisição');
            }
            
            let urlOriginal: string;
    
            //Verificar se a URL já está na base
            const urlResponseDB = await Url.findOne({ shortened: shortURL });
            
            if (urlResponseDB) {
                // urlOriginal = "http://www.dba-oracle.com/t_calling_oracle_function.htm"; //Descomentar para testes
                urlOriginal = urlResponseDB.original;
            } else {
                throw new BadRequestError('URL não encontrada na base de dados!');
            }
    
            const response: IUrl = {original: urlOriginal,
                                    shortened: shortURL,
                                    url_shortened: shortURL};                             
    
            //redirecionar 
            // return res.status(StatusCodes.OK).send(response); //Descomentar para teste
            return res.redirect(response.original) //Redirecionar para a URL original
        } catch (error) {
            next(error);            
        }
    }
}
