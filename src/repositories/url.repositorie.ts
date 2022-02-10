// import { generateShortid } from "../controllers/shortener.controller";
import DatabaseError from '../models/errors/database.error.model';
import { IUrl, Url } from '../models/url.model';

export interface IQueryParams {
  field: string;
  value: string;
}

class UrlRepository {
  public async findUrlShortened(urlData: IUrl): Promise<IUrl> {
    try {
      const rows = await Url.findOne({ original: urlData.original });
      // const rows = await Url.findOne({ original: urlData.original });
      // const rows: IUrl= {
      //     original: urlData.original,
      //     shortened: generateShortid()
      // }; //TO DO: Remover apos ajustar conexão com o banco (MOCK)

      return rows || { original: urlData.original };
    } catch (error) {
      throw new DatabaseError('Erro ao consultar a URL', error);
    }
  }

  public async findUrlOriginal(shortURL: string): Promise<IUrl> {
    try {
      // const rows = await Url.findOne({ shortened: shortURL });
      const rows: IUrl = {
        original: 'http://www.dba-oracle.com/t_calling_oracle_function.htm',
        shortened: shortURL,
      }; //TO DO: Remover apos ajustar conexão com o banco (MOCK)

      return rows || { original: '' };
    } catch (error) {
      throw new DatabaseError('Erro ao consultar a URL', error);
    }
  }

  public async create(urlData: IUrl): Promise<void> {
    try {
      const newUrl = new Url(urlData);
      await newUrl.save();
    } catch (error) {
      throw new DatabaseError('Erro ao gravar a URL no banco', error);
    }
  }
}

export default UrlRepository;
