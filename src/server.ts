import express, { Request, Response } from 'express';
import logger from './logger';
import cors from 'cors';
import config from 'config';
import expressPino from 'express-pino-logger';
import shortenerRoute from './routes/shortener.route';
import MongoConnection from './database/MongoConnection';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';

class SetupServer {
  
  app: express.Express;
  db = new MongoConnection();
  
  constructor(private port = 3333) {
    this.app = express();
  }
  
  private setupExpress(): void {

    this.app.use(express.json()); //Middleware p/ lidar c/ o JSON no Content-Type
    this.app.use(express.urlencoded({ extended: true })); //Middleware p/ realizar o parsing do conteúdo das requisições
    
    const enableLogReqs =  config.get('App.logger.enabled_log_reqs') as boolean;
    if (enableLogReqs) {
      this.app.use(expressPino({logger}));
    }

    this.app.use(cors({origin: config.get('App.cors.origin')} )); //Permitir CORS
  }
  
  private setupControllers(): void {
    this.app.use('/', shortenerRoute); 
  }

  private setupErrorHandlers(): void {
    this.app.use(errorHandlerMiddleware)
  }

  private async setupDatabase(): Promise<void> {
    // this.db.connect();
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