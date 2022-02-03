import config from "config";
import { Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';
import shortid from "shortid";

class ShortenerController {

    public async create (req: Request, res: Response, next: NextFunction) {
        
        const urlOriginal = req.body.url;

        //Verificar se a URL já está na base
        
        //Encurtar a URL
        const urlID = shortid.generate();
        
        //Montagem da URL dp server
        const urlServer = config.get('App.url_api') as string + config.get('App.port') as string;

        const urlShortened = `${urlServer}/${urlID}`;

        //Gravar a URL na base

        //Retornar
        const response = {"url_original": urlOriginal,
                          "url_shortened": urlShortened
                         };

        return res.status(StatusCodes.OK).send(response); //Responder a requisição c/ o Status 200
    }

    public async redirect (req: Request, res: Response, next: NextFunction) {
        const urlShort = req.params;

        //Descobrir a URL no banco
        const url = {"url_original": "http://www.dba-oracle.com/t_calling_oracle_function.htm",
                     "url_shortened": urlShort
                    };

        //redirecionar 
        return res.redirect(url.url_original)
    }


}

export default ShortenerController;
