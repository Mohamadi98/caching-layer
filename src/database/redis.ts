import redis, { createClient } from "redis";

export let redisClient: redis.RedisClientType

export const initRedis = async() => {
    redisClient = createClient();

    try {
        await redisClient.connect();
    } catch (error) {
        console.log("Error connecting to redis: ", error);
        process.exit(1);
    }
}