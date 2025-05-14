import pg, { Client} from 'pg';
import { env } from '../config/env';

const connectionString = env.databaseUrl;

export let dbClient: pg.Client;

export const initDB = async() => {
    dbClient = new Client({
        connectionString,
    });

    try {
        await dbClient.connect();
    } catch (error) {
        console.log('Error connecting to database: ', error);
        process.exit(1);
    }
}