import { Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';

class ShortenerController {

    public list (req: Request, res: Response) {
        const response = {foo: 'bar'};
        return res.status(StatusCodes.OK).send(response); //Responder a requisição c/ o Status 200
    }

    public async create (req: Request, res: Response, next: NextFunction) {
        
        const url_original = req.body.url;

        //Verificar se a URL já está na base

        //Encurtar a URL

        //Gravar a URL na base

        //Retornar


        const response = {foo: url_original};
        return res.status(StatusCodes.OK).send(response); //Responder a requisição c/ o Status 200
    }
}

export default ShortenerController;
