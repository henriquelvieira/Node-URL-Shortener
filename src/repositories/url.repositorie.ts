import { generateShortid } from '../controllers/shortener.controller';
import { getRedis, setRedis } from '../database/RedisConnection';
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

//TODO: REMOVER, USADO COMO MOCK DA BASE
const mockDb = [
  {
    original: 'http://www.dba-oracle.com/t_calling_oracle_function.htm',
    shortened: '123abc',
  },
  {
    original: 'https://google.com',
    shortened: '456abc',
  },
];

class UrlRepository implements IUrlRepository {
  public async findUrlShortened(urlData: IUrl): Promise<IUrl | never> {
    try {
      //   const rows = await Url.findOne({ original: urlData.original }); //TODO: DESCOMENTAR

      //MOCK (INI)
      const returnDB = mockDb.find(
        (registers) => registers.original === urlData.original
      );

      let rows: IUrl;

      if (returnDB) {
        rows = {
          original: returnDB.original,
          shortened: generateShortid(),
        }; //TO DO: Remover apos ajustar conexão com o banco (MOCK)
      } else {
        rows = { original: urlData.original };
      }
      //MOCK (FIM)

      return rows;
    } catch (error) {
      throw new DatabaseError('Erro ao consultar a URL', error);
    }
  }

  public async findUrlOriginal(shortURL: string): Promise<IUrl | never> {
    try {
      const urlRedis = await getRedis(`url-${shortURL}`); //Verificar se a URL já está no Redis

      if (urlRedis || urlRedis.length > 0) {
        const rows = JSON.parse(urlRedis);
      } else {
        const rows = await Url.findOne({ shortened: shortURL }); //TODO: DESCOMENTAR
        await setRedis(`url-${shortURL}`, JSON.stringify(rows)); //ADICIONAR A URL AO REDIS
      }

      //MOCK (INI)
      const returnDB = mockDb.find(
        (registers) => registers.shortened === shortURL
      );

      let rows: IUrl;

      if (returnDB) {
        rows = {
          original: returnDB.original,
          shortened: shortURL,
        }; //TO DO: Remover apos ajustar conexão com o banco (MOCK)
      } else {
        rows = { original: '' };
      }
      //MOCK (FIM)

      return rows;
    } catch (error) {
      throw new DatabaseError('Erro ao consultar a URL', error);
    }
  }

  public async create(urlData: IUrl): Promise<void> {
    try {
      //   const newUrl = new Url(urlData);
      //   await newUrl.save();
      //   await setRedis(`url-${urlData.shortened}`, JSON.stringify(urlData)); //ADICIONAR A URL AO REDIS

      //TODO: REMOVER (MOCK)
      mockDb.push({
        original: urlData.original,
        shortened: urlData.shortened ?? '',
      });
    } catch (error) {
      throw new DatabaseError('Erro ao gravar a URL no banco', error);
    }
  }
}

export default UrlRepository;
