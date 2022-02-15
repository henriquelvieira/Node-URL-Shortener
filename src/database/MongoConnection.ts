import { connect as mongooseConnect, connection } from 'mongoose';

import logger from '../logger';
import DatabaseError from '../models/errors/database.error.model';
import Configs from '../util/configs';
import Env from '../util/env';

class MongoConnection {
  private getStringConnection(): string {
    const configs = Configs.get('App.envs.MONGODB');

    const connectionString = Env.get(configs.get('connectionString')) as string;
    return connectionString;
  }

  public async connect(): Promise<boolean> {
    try {
      const connectionString = this.getStringConnection();

      // await mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })

      try {
        await mongooseConnect(connectionString);
      } catch (error) {
        throw new DatabaseError('Database not connected', error);
      }

      logger.info('Database connected');
      return true;
    } catch (error) {
      logger.error('Database not connected', error);
      return false;
    }
  }

  public async close(): Promise<void> {
    await connection.close();
  }
}

export default MongoConnection;
