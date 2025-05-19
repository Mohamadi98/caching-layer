import { RequestHandler } from "express";
import { dbClient } from "../database/postgres";
import { redisClient } from "../database/redis";

export const getProducts: RequestHandler = async(_req, res) => {
    const results = await dbClient.query('SELECT * FROM products;');
    res.status(200).send({
        data: results.rows
    });
}

export const getProductsById: RequestHandler = async(req, res) => {
    const id = req.params.id;
    let result;
    let fromCache = false;
    const cachedData = await redisClient.get(id);

    if(cachedData) {
        fromCache = true;
        result = JSON.parse(cachedData);
    } else {
        const dbData = await dbClient.query('SELECT * FROM products WHERE id = $1', [id]);
        result = dbData.rows[0];
        await redisClient.set(req.params.id, JSON.stringify(result));
    }
    res.status(200).send({
        fromCache: fromCache,
        data: result
    });
}