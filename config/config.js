let config = {};

config.redisHost = process.env.REDIS_HOST || 'redis';
config.redisPort = Number(process.env.REDIS_PORT) || Number(6379);

config.createRedisClient = () => {
  const client = require('redis').createClient({
    url: `redis://${config.redisHost}:${config.redisPort}`,
  });
  console.log('Connect redis client...');
  client.on('error', (err) => {
    console.log('Redis Client Error', err);
  });
  client.connect().then(() => console.log('Successfully connected to redis'));
  return client;
};

module.exports = config;
