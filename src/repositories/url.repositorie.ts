// import { generateShortid } from '../controllers/shortener.controller';
import RedisClient from '../database/RedisConnection';
import DatabaseError from '../models/errors/database.error.model';
import { RegisterAccess } from '../models/registerAccess.model';
import { IUrl, Url } from '../models/url.model';
export interface IQueryParams {
  field: string;
  value: string;
}

// Repository interface
export interface IUrlRepository {
  findAll(): Promise<IUrl[] | never>;
  findUrlShortened(urlData: IUrl): Promise<IUrl | never>;
  findUrlOriginal(shortURL: string): Promise<IUrl | never>;
  create(urlData: IUrl): Promise<void>;
  registerAccess(shortURL: string): Promise<void>;
}

class UrlRepository implements IUrlRepository {
  public async findAll(): Promise<IUrl[]> {
    try {
      const returnDB = await Url.find();
      return returnDB;
    } catch (error) {
      throw new DatabaseError('Erro ao consultar a URL', error);
    }
  }

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
      const redisCache = await RedisClient.get(`urlShortened-${shortURL}`); //Verifica se a URL já está no Redis

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

          const redisExpirationTimeInSeconds = 60 * 5; // 5 minutos
          const redisKey = `urlShortened-${shortURL}`;
          const redisValue = JSON.stringify(rows);
          RedisClient.set(redisKey, redisValue, redisExpirationTimeInSeconds); //Adiciona a URL ao Redis
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

      const redisExpirationTimeInSeconds = 60 * 5; // 5 minutos
      const redisKey = `urlShortened-${urlData.shortened}`;
      const redisValue = JSON.stringify(urlData);
      RedisClient.set(redisKey, redisValue, redisExpirationTimeInSeconds); //Adiciona a URL ao Redis
    } catch (error) {
      throw new DatabaseError('Erro ao gravar a URL no banco', error);
    }
  }

  public async incrementAccessURLCounter(shortURL: string): Promise<number> {
    try {
      const returnDB = await Url.findOne({ shortened: shortURL });
      if (returnDB) {
        const urlId = returnDB.id;
        const RegisterAccessCounter = new RegisterAccess({ url: urlId });
        await RegisterAccessCounter.save();

        const counter = await RegisterAccess.countDocuments({ url: urlId });
        return counter;
      } else {
        return 0;
      }
    } catch (error) {
      throw new DatabaseError('Erro ao registrar o acesso', error);
    }
  }

  public async registerAccess(shortURL: string): Promise<void> {
    const counter = await this.incrementAccessURLCounter(shortURL);

    const filter = { shortened: shortURL };
    const update = { $set: { lastAccessAt: Date.now(), counter: counter } };
    await Url.updateOne(filter, update);
  }
}

export default UrlRepository;
