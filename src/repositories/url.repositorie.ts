import { IUrl, Url } from "../models/url.model";

class UrlRepository {

    public async findUrl (urlData: IUrl): Promise<IUrl> {
        const urlResponseDB = await Url.findOne({ original: urlData.original });

        const response: IUrl = {original: urlResponseDB.original } 

        return urlResponseDB;
    }

}

export default UrlRepository;