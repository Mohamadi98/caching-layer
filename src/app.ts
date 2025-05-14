import express from 'express';
import { initDB } from './database/postgres';

(async () => {
    await initDB();

    const app = express();

    app.listen(3000, () => {
        console.log('Server started at port: 3000');
    });
})();