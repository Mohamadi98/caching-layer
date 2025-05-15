import express from 'express';
import { initDB } from './database/postgres';
import { initRedis } from './database/redis';

(async () => {
    await initDB();
    await initRedis();

    const app = express();

    app.listen(3000, () => {
        console.log('Server started at port: 3000');
    });
})();