const config = require('../config/config');
const redisClient = config.createRedisClient();
const Promise = require('bluebird');

module.exports = {
  getClient: (clientId, clientSecret) => {
    return redisClient.hGetAll(`client:${clientId}`).then((client) => {
      return {
        id: clientId,
        redirectUris: client.redirectUris.split(','),
        grants: client.grants.split(','),
        accessTokenLifetime: Number(client.accessTokenLifetime),
      };
    });
  },
  saveToken: (token, client, user) => {
    return Promise.all([
      redisClient.hSet(`accessToken:${token.accessToken}`, {
        accessToken: token.accessToken,
        expiresAt: token.accessTokenExpiresAt,
        scope: token.scope || '',
        clientId: client.id,
        userId: user.id,
      }),
      redisClient.hSet(`refreshToken:${token.refreshToken}`, {
        refreshToken: token.refreshToken,
        scope: token.scope || '',
        clientId: client.id,
        userId: user.id,
      }),
    ]).then(() => {
      return {
        accessToken: token.accessToken,
        accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
        refreshToken: token.refreshToken,
        scope: token.scope || '',
        client: { id: client.id },
        user: { id: user.id },
      };
    });
  },
  getAccessToken: (accessToken) => {
    return redisClient
      .hGetAll(`accessToken:${accessToken}`)
      .then((accessTokenObject) => {
        if (typeof accessTokenObject !== undefined) {
          return redisClient.hGetAll(`user:${accessTokenObject.userId}`).then((userObject) => {
            return {
              accessToken: accessTokenObject.accessToken,
              scope: accessTokenObject.scope || '',
              accessTokenExpiresAt: new Date(accessTokenObject.expiresAt),
              client: { id: accessTokenObject.clientId },
              user: userObject,
            };
          });
        } else {
          return false;
        }
      })
      .catch((reason) => {
        return false;
      });
  },
  getRefreshToken: (refreshToken) => {
    return redisClient.hGetAll(`refreshToken:${refreshToken}`).then((refreshTokenObject) => {
      if (typeof refreshTokenObject !== undefined) {
        return {
          refreshToken: refreshTokenObject.refreshToken,
          scope: refreshTokenObject.scope || '',
          client: { id: refreshTokenObject.clientId },
          user: { id: refreshTokenObject.userId },
        };
      } else {
        return false;
      }
    });
  },
  revokeToken: (refreshToken) => {
    return redisClient.del(`refreshToken:${refreshToken}`).then(
      (value) => {
        return true;
      },
      (reason) => {
        return false;
      },
    );
  },
  saveAuthorizationCode: (code, client, user) => {
    return redisClient
      .hSet(`authCode:${code.authorizationCode}`, {
        authorizationCode: code.authorizationCode,
        expiresAt: code.expiresAt,
        redirectUri: code.redirectUri,
        clientId: client.id,
        userId: user.id,
      })
      .then(() => {
        return {
          authorizationCode: code.authorizationCode,
          expiresAt: new Date(code.expiresAt),
          redirectUri: code.redirectUri,
          client: { id: client.id },
          user: { id: user.id },
        };
      });
  },
  getAuthorizationCode: (authorizationCode) => {
    return redisClient.hGetAll(`authCode:${authorizationCode}`).then((authCode) => {
      return {
        code: authCode.authorizationCode,
        expiresAt: new Date(authCode.expiresAt),
        redirectUri: authCode.redirectUri,
        client: { id: authCode.clientId },
        user: { id: authCode.userId },
      };
    });
  },
  revokeAuthorizationCode: (authorizationCode) => {
    return redisClient.del(`authCode:${authorizationCode}`).then(
      () => {
        return true;
      },
      () => {
        return false;
      },
    );
  },
  verifyScope: (accessToken, scope) => {
    return redisClient.hGet(`accessToken:${accessToken}`, 'scope').then((grantedScopes) => {
      const requestedScopes = scope.split(' ');
      const authorizedScopes = grantedScopes.split(' ');
      return requestedScopes.every((s) => authorizedScopes.indexOf(s) >= 0);
    });
  },
};
