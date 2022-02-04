import { Request, Response, NextFunction } from "express";
import config from "config";
import {StatusCodes} from 'http-status-codes';
import shortid from "shortid";
import { Url } from "../@types/url.type";

export function generateShortid() {
    const urlID = shortid.generate() as string;
    return urlID;
};

export class ShortenerController {

    public async create (req: Request, res: Response, next: NextFunction) {
        //Pegar o conteudo da requisição
        const url: Url = req.body;

        //Verificar se a URL já está na base
        
        //Encurtar a URL       
        const urlID = generateShortid();

        //Montagem da URL do Server
        const urlServer = config.get('App.url_api') as string + config.get('App.port') as string;
        const urlShortened = `${urlServer}/${urlID}`;

        //Gravar a URL na base

        //Retornar
        const response = {"url_original": url.url_original,
                          "url_shortened": urlShortened
                         };

        return res.status(StatusCodes.OK).send(response); //Responder a requisição c/ o Status 200
    }

    public async redirect (req: Request<{ shortURL: string }>, res: Response, next: NextFunction) {
        
        const shortURL = req.params.shortURL;

        //Descobrir a URL no banco
        const urlOriginal = "http://www.dba-oracle.com/t_calling_oracle_function.htm";


        const response: Url = {url_original: urlOriginal,
                               url_shortened: shortURL};                             

        //redirecionar 
        return res.status(StatusCodes.OK).send(response); 
        // return res.redirect(response.url_original)
    }
};
