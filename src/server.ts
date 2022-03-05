import cors from 'cors';
import express, { Request, Response } from 'express';
import expressPino from 'express-pino-logger';

import MongoConnection from './database/MongoConnection';
import RedisClient from './database/RedisConnection';
import logger from './logger';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';
import shortenerRoute from './routes/shortener.route';
import Configs from './util/configs';

class SetupServer {
  app: express.Express;
  db = new MongoConnection();
  readonly configs = Configs.get('App');

  constructor(private port = 3333) {
    this.app = express();
  }

  private setupExpress(): void {
    this.app.use(express.json()); //Middleware p/ lidar c/ o JSON no Content-Type
    this.app.use(express.urlencoded({ extended: true })); //Middleware p/ realizar o parsing do conteúdo das requisições

    const enableLogReqs: boolean =
      this.configs.get('logger.enabledLogReqs') || true;

    if (enableLogReqs) {
      this.app.use(expressPino({ logger }));
    }

    this.app.use(cors({ origin: this.configs.get('cors.origin') })); //Permitir CORS
  }

  private setupControllers(): void {
    this.app.use('/', shortenerRoute);
  }

  private setupErrorHandlers(): void {
    this.app.use(errorHandlerMiddleware);
  }

  private async setupDatabase(): Promise<void> {
    const connect: boolean = this.configs.get('database.connect');
    if (connect) {
      await this.db.connect();
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

  public start(): boolean {
    this.app.listen(this.port, () => {
      logger.info(`Server is running on port ${this.port}`);
    });
    return true;
  }

  public async close(): Promise<void> {
    this.db.close();
    RedisClient.close();
  }

  public getApp(): express.Express {
    return this.app;
  }
}

export default SetupServer;
