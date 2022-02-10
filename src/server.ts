import config, { IConfig } from 'config';
import cors from 'cors';
import express, { Request, Response } from 'express';
import expressPino from 'express-pino-logger';

import MongoConnection from './database/MongoConnection';
import logger from './logger';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';
import shortenerRoute from './routes/shortener.route';

class SetupServer {
  app: express.Express;
  db = new MongoConnection();

  constructor(private port = 3333) {
    this.app = express();
  }

  private setupExpress(): void {
    const configs: IConfig = config.get('App');

    this.app.use(express.json()); //Middleware p/ lidar c/ o JSON no Content-Type
    this.app.use(express.urlencoded({ extended: true })); //Middleware p/ realizar o parsing do conteúdo das requisições

    const enableLogReqs = configs.get('logger.enabled_log_reqs') as boolean;
    if (enableLogReqs) {
      this.app.use(expressPino({ logger }));
    }

    this.app.use(cors({ origin: configs.get('cors.origin') })); //Permitir CORS
  }

  private setupControllers(): void {
    this.app.use('/', shortenerRoute);
  }

  private setupErrorHandlers(): void {
    this.app.use(errorHandlerMiddleware);
  }

  private async setupDatabase(): Promise<void> {
    const configs: IConfig = config.get('App');
    const connect = configs.get('database.connect') as boolean;
    if (connect) {
      this.db.connect(); //TO DO: DESCOMENTAR
    }
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();

    await this.setupDatabase();

    this.setupErrorHandlers();

    this.app.use('/', (req: Request, res: Response) => {
      res.json({ message: 'ok' });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info(`Server is running on port  ${this.port}`);
    });
  }

  public close(): void {
    this.db.close();
  }

  public getApp(): express.Express {
    return this.app;
  }
}

export default SetupServer;
