const config = require('./config/config');
const redisClient = config.createRedisClient();
redisClient.connect();

module.exports = {
    getClient: (clientId, clientSecret) => {
        return new Promise((resolve, reject) => {
            const client = await redisClient.hGetAll("client");
            if (client.clientId === clientId && client.clientSecret === clientSecret) {
                resolve(client);
            } else {
                reject('Invalid client id!');
            }
        })
    },
    saveToken: (token, client, user) => {
        return new Promise((resolve, reject) => {
            const tokenObject = {
                accessToken: token.accessToken,
                accessTokenExpiresAt: token.accessTokenExpiresAt,
                refreshToken: token.refreshToken,
                client: client,
                user: user
            }
            // TODO: maybe some validation required?
            redisClient.hSet("token", tokenObject);
            resolve(token);
        })
    },
    getAccessToken: token => {
        return new Promise((resolve, reject) => {
            const persistedToken = await redisClient.hGetAll("token");
            if (token === persistedToken) { // TODO: maybe compare just some values !?
                resolve(persistedToken)
            } else {
                return false;
            }
        })
    },
    // ...
}