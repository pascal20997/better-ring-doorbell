let config = {};

config.redisHost = process.env.REDIS_HOST || "redis";
config.redisPort = Number(process.env.REDIS_PORT) || Number(6379);

config.createRedisClient = () => {
    return require('redis').createClient({
        url: `redis://${config.redisHost}:${config.redisPort}`
    })
}

module.exports = config;