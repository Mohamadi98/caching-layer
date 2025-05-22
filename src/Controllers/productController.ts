import { RequestHandler } from "express";
import { dbClient } from "../database/postgres";
import { redisClient } from "../database/redis";

export const getProducts: RequestHandler = async(req, res) => {
    const rowCount = await dbClient.query('SELECT COUNT(id) from products;');
    const countValue = parseInt(rowCount.rows[0].count as string, 10);

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(countValue / limit);
    
    if(offset >= countValue) {
        res.status(400).send({
            message: 'Exceeded rows count!',
            totalPages: totalPages,
        });
        return
    }

    try {
        const results = await dbClient.query('SELECT * FROM products OFFSET $1 LIMIT $2;', [offset, limit]);
        res.status(200).send({
            data: results.rows,
            totalPages: totalPages,
        });
    } catch (error) {
        console.log('Error: ', error);
    }
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