import { RequestHandler } from "express";
import { dbClient } from "../database/postgres";

export const getProducts: RequestHandler = async(_req, res) => {
    const results = await dbClient.query('SELECT * FROM products;');
    res.status(200).send({
        data: results.rows
    });
}

export const getProductsById: RequestHandler = async(req, res) => {
    const result = await dbClient.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    res.status(200).send({
        data: result.rows[0]
    });
}