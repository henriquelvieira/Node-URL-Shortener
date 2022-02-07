import { connect as mongooseConnect, connection } from 'mongoose';
import config, { IConfig } from 'config';
import * as dotenv from "dotenv";
import logger from '../logger';
dotenv.config();

class MongoConnection {
	
	private getStringConnection(): string {
		const connectionString = process.env[config.get('App.envs.MONGODB.connectionString') as string] as string;
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