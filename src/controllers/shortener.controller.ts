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
        logger.info(`Falha ao gerar o Shortid da URL ${error}`);      
        throw new BadRequestError('Falha ao gerar a Shortid');  
    }    
};

export class ShortenerController {

    public async create (req: Request, res: Response, next: NextFunction) {
        
        try {
            const configs: IConfig = config.get('App');

            //Pegar o conteudo da requisição
            const urlReq: IUrl = req.body;

            //Validar se a URL foi informada
            if (!urlReq.original){
                throw new BadRequestError('campo url_original não informado no requisição');
            }            

            //Verificar se a URL já está na base
            // const urlResponseDB = await Url.findOne({ original: urlReq.original });
            const urlResponseDB = {}; //TO DO: Remover apos ajustar conexão com o banco
            let urlID: string; 
            let newRegister: boolean = false;

            if (urlResponseDB) {
                //Buscar a Short URL que já está no banco
                // const urlID = urlResponseDB.shortened;   

                urlID = generateShortid(); //TO DO: Remover apos ajustar conexão com o banco
            } else {                
                newRegister = true;
                
                //Encurtar a URL       
                urlID = generateShortid();
            };

    
            //Montagem da URL do Server
            const urlServer = configs.get('url_api') as string + configs.get('port') as string;
            const urlShortened = `${urlServer}/${urlID}`;
    
            const newRecord: IUrl = {
                original: urlReq.original,
                shortened: urlID,
            };
            
            //Gravar a URL na base
            // if (newRegister) {
            //     try {
            //         const newUrl = new Url(newRecord);
            //         const resultDB = await newUrl.save();                
            //     } catch (error) {
            //         throw new DatabaseError('Falha ao gravar a URL no banco!');                
            //     }
            // }
    
            //Retornar
            const response: IUrl = {...newRecord,
                                    url_shortened: urlShortened};
    
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
    
    
            const response: IUrl = {original: urlOriginal,
                                    shortened: shortURL,
                                    url_shortened: shortURL};                             
    
            //redirecionar 
            return res.status(StatusCodes.OK).send(response); 
            // return res.redirect(response.url_original)
        } catch (error) {
            next(error);            
        }
    }
};
