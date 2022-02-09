import { IUrl, Url } from "../models/url.model";

class UrlRepository {

    public async findUrl (urlData: IUrl): Promise<IUrl> {
        const urlResponseDB = await Url.findOne({ original: urlData.original });
        let response: IUrl;
        if (urlResponseDB) {
            response =  urlResponseDB ;
        } else {
            response =  {original: ""} ;
        }

        return response;
    }

}

export default UrlRepository;