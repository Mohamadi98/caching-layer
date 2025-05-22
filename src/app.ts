import express from 'express';
import bodyParser from 'body-parser';
import { initDB } from './database/postgres';
import { initRedis } from './database/redis';
import { getProducts, getProductsById } from './Controllers/productController';
import { DateTime } from 'luxon';

(async () => {
    await initDB();
    await initRedis();

    const app = express();
    app.use(bodyParser.json());

    const requestLogger: express.RequestHandler = (req, _res, next) => {
        console.log(
            req.method, req.path, " Body- ", req.body, " Params- ", req.params, "-",
                DateTime.now().toISO());
        next();
    }

    app.use(requestLogger);

    app.get('/healthz', (_req, res) => {
        res.send({Status: "OK"});
    });
    app.get('/products', getProducts);
    app.get('/products/:id', getProductsById);

    app.listen(3000, () => {
        console.log('Server started at port: 3000');
    });
})();