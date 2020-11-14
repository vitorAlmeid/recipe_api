'use strict';

const Redis = require('ioredis');

const RedisClient = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST);

RedisClient.on('ready', () => {
    console.log(`app:redis:connection:ready, REDIS READY @ ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
});

RedisClient.on('error', error => {
    console.log(`app:redis:error', ${error.message}`);
});

const set = function set(key, value, TTL) {
    RedisClient.set(key, JSON.stringify(value), (error, reply) => {
        if (error) {
            console.log(`app:redis:set:error, ${error.message}`);
        }
        if (TTL) {
            RedisClient.expire(key, TTL);
        }
    });
};

const get = function get(key, callback) {
    RedisClient.get(key, (error, value) => {
        if (error) {
            Logger.log(`app:redis:get:error, ${error.message}`);
            return callback(true);
        }
        return callback(null, JSON.parse(value));
    });
};

module.exports = {
    set,
    get,
};
