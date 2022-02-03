import mongoose from 'mongoose';
import config from 'config';
import * as dotenv from "dotenv";
import logger from '../logger';
dotenv.config();


class MongoConnection {
	
	private getConnection(): string {
		const connection = process.env[config.get('App.envs.MONGODB.connectionString') as string] as string;
		return connection;
	}
	
	public async connect(): Promise<void> {
		try {		
			const connection = this.getConnection();
			
			await mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
			
			logger.info('Database connected');
		} catch (error) {
			logger.error(`Database not connected - ${error}`);
			process.exit(1)
		}
	}
}

export default MongoConnection;