// setup process that creates a client id and client secret for your Google Actions project

const redisClient = require('./config/config').createRedisClient();
const prompts = require('prompts');

(async () => {
  redisClient.connect();

  let client = {
    id: require('crypto').randomBytes(64).toString('hex'),
    clientSecret: require('crypto').randomBytes(128).toString('hex'),
    grants: ['authorization_code', 'refresh_token'],
    accessTokenLifetime: 3600,
    projectId: '',
    redirectUris: [],
  };

  console.log('Welcome to the Better Ring Doorbell Project by kronova.net!');
  console.log(
    'Use this setup to create your own Google Action for your Ring Doorbell(s). Read the README.md before you continue the setup!',
  );

  const response = await prompts([
    {
      type: 'text',
      name: 'projectId',
      message: 'Google Actions Project ID',
    },
    {
      type: 'text',
      name: 'clientId',
      message: 'Client ID for Google Actions',
      initial: client.clientId,
    },
    {
      type: 'text',
      name: 'clientSecret',
      message: 'Client Secret for Google Actions',
      initial: client.clientSecret,
    },
  ]);

  client.id = response.clientId;
  client.clientSecret = response.clientSecret;
  client.projectId = response.projectId;
  client.redirectUris = [
    `https://oauth-redirect.googleusercontent.com/r/${response.projectId}`,
    `https://oauth-redirect-sandbox.googleusercontent.com/r/${response.projectId}`,
  ];

  console.log('The next step is the authorization with ring.com. Please follow the instructions:');
  const refreshTokenApi = require('ring-client-api/lib/api/refresh-token');

  const refreshToken = await refreshTokenApi.acquireRefreshToken();

  console.log('Save credentials...');
  await redisClient.hSet(`client:${client.clientId}`, client);
  console.log('Save ring.com refresh token...');
  await redisClient.hSet('user:1', { id: 1, ringRefreshToken: refreshToken });

  console.log('Use the following information to setup the account linking of your Google Action:');
  console.log(`Client ID: ${client.clientId}`);
  console.log(`Client Secret: ${client.clientSecret}`);

  redisClient.disconnect();
  process.exit();
})();
