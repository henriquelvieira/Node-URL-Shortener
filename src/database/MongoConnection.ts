import { connect as mongooseConnect, connection } from 'mongoose';

import logger from '../logger';
import Configs from '../util/configs';
import Env from '../util/env';

class MongoConnection {
  private getStringConnection(): string {
    const configs = Configs.get('App.envs.MONGODB');

    const connectionString = Env.get(configs.get('connectionString')) as string;
    return connectionString;
  }

  public async connect(): Promise<void> {
    try {
      const connectionString = this.getStringConnection();

      // await mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
      await mongooseConnect(connectionString);
      logger.info('Database connected');
    } catch (error) {
      logger.error(`Database not connected - ${error}`);
    }
  }

  public async close(): Promise<void> {
    connection.close();
  }
}

export default MongoConnection;
