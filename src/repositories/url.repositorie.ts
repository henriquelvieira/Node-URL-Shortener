// import { generateShortid } from '../controllers/shortener.controller';
import RedisClient from '../database/RedisConnection';
import DatabaseError from '../models/errors/database.error.model';
import { IUrl, Url } from '../models/url.model';
export interface IQueryParams {
  field: string;
  value: string;
}

// Repository interface
export interface IUrlRepository {
  findUrlShortened(urlData: IUrl): Promise<IUrl | never>;
  findUrlOriginal(shortURL: string): Promise<IUrl | never>;
  create(urlData: IUrl): Promise<void>;
}

class UrlRepository implements IUrlRepository {
  public async findUrlShortened(urlData: IUrl): Promise<IUrl | never> {
    let rows: IUrl;

    try {
      const returnDB = await Url.findOne({ original: urlData.original }); //Verifica se a URL já está no banco

      if (returnDB) {
        rows = {
          original: returnDB.original,
          shortened: returnDB.shortened,
        };
      } else {
        rows = { original: '' };
      }

      return rows;
    } catch (error) {
      throw new DatabaseError('Erro ao consultar a URL', error);
    }
  }

  public async findUrlOriginal(shortURL: string): Promise<IUrl | never> {
    try {
      const redisCache = await RedisClient.get(`url-${shortURL}`); //Verifica se a URL já está no Redis

      if (redisCache) {
        const rows: IUrl = JSON.parse(redisCache); //Convertendo a string para JSON
        return rows;
      } else {
        const returnDB = await Url.findOne({ shortened: shortURL }); //Verifica se a ShortURL está no banco

        if (returnDB) {
          const rows: IUrl = {
            original: returnDB.original,
            shortened: shortURL,
          };

          RedisClient.set(`url-${shortURL}`, JSON.stringify(rows), 60 * 5); //Adicionando a URL ao Redis

          return rows;
        } else {
          return { original: '' };
        }
      }
    } catch (error) {
      throw new DatabaseError('Erro ao consultar a URL', error);
    }
  }

  public async create(urlData: IUrl): Promise<void> {
    try {
      const newUrl = new Url(urlData);
      await newUrl.save();

      RedisClient.set(
        `url-${urlData.shortened}`,
        JSON.stringify(urlData),
        60 * 5
      ); //Adicionando a URL ao Redis
    } catch (error) {
      throw new DatabaseError('Erro ao gravar a URL no banco', error);
    }
  }
}

export default UrlRepository;
