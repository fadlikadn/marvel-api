"use strict";

import path from "path";

const redis = require("redis");
const { promisify } = require("util");
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "..", "config");
const config = require("config");
const redisConfig = config.get("redisConfig");
const redisClient = redis.createClient({
    host: redisConfig.host,
    port: redisConfig.port,
});

try {
    redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
    redisClient.setAsync = promisify(redisClient.set).bind(redisClient);
    redisClient.lpushAsync = promisify(redisClient.lpush).bind(redisClient);
    redisClient.lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
    redisClient.llenAsync = promisify(redisClient.llen).bind(redisClient);
    redisClient.lremAsync = promisify(redisClient.lrem).bind(redisClient);
    redisClient.lsetAsync = promisify(redisClient.lset).bind(redisClient);
    redisClient.hmsetAsync = promisify(redisClient.hmset).bind(redisClient);
    redisClient.hmgetAsync = promisify(redisClient.hmget).bind(redisClient);
    redisClient.clear = promisify(redisClient.del).bind(redisClient);
    console.log("set up");
} catch (e) {
    console.log("redis error", e);
}

redisClient.on("connected", () => {
    console.log("Redis is connected");
});

redisClient.on("error", (err: any) => {
    console.log("Redis error.", err);
});

setInterval(() => {
    console.log("Keeping Redis alive");
    redisClient.set("ping", "pong pong");
}, 1000 * 60 * 4);

global.MarvelCache = redisClient;
module.exports = redisClient;
