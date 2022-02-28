// file to manually update the refresh token if token in db is not valid!
const config = require('./config/config');

(async () => {
  console.log('Please follow the instructions to update the refresh token. Type in the ring.com credentials:');
  const refreshTokenApi = require('ring-client-api/lib/api/refresh-token');

  const refreshToken = await refreshTokenApi.acquireRefreshToken();

  console.log('Save ring.com refresh token...');
  await config.getRedisClient().hSet('user:1', { id: 1, ringRefreshToken: refreshToken });

  console.log('Done');
  config.getRedisClient().disconnect();
  process.exit();
})();
