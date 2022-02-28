const { RingApi } = require('ring-client-api');
const redis = require('redis');

let config = {};

config.redisHost = process.env.REDIS_HOST || 'redis';
config.redisPort = Number(process.env.REDIS_PORT) || Number(6379);

let redisClient;
let ringApiInstances = {};

/**
 * @returns {import('@node-redis/client').RedisClientType}
 */
config.getRedisClient = () => {
  if (typeof redisClient === 'undefined') {
    redisClient = redis.createClient({
      url: `redis://${config.redisHost}:${config.redisPort}`,
    });
    console.log('Connect redis client...');
    redisClient.on('error', (err) => {
      console.log('Redis Client Error', err);
    });
    redisClient.connect().then(() => console.log('Successfully connected to redis'));
  }
  return redisClient;
};

/**
 *
 * @param {} user
 * @returns {RingApi}
 */
config.getRingApiForUser = (user) => {
  if (!(user.id in ringApiInstances)) {
    console.log(`Initialize API Instance for user ${user.id}...`);
    ringApiInstances[user.id] = new RingApi({
      refreshToken: user.ringRefreshToken,
      cameraStatusPollingSeconds: 20,
      cameraDingsPollingSeconds: 1,
    });
  }
  return ringApiInstances[user.id];
};

module.exports = config;
