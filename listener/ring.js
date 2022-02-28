const config = require('../config/config');

/**
 * This is working for one user only. Do we really need multiple users on one instance?
 */

module.exports = {
  initialize: async () => {
    const user1 = await config.getRedisClient().hGetAll('user:1');
    const ringApi = config.getRingApiForUser(user1);

    ringApi.onRefreshTokenUpdated.subscribe(({ newRefreshToken, oldRefreshToken }) => {
      if (!oldRefreshToken) {
        return;
      }
      console.log(`Update refresh token for user ${user1.id}...`);
      config
        .getRedisClient()
        .hSet('user:1', 'ringRefreshToken', newRefreshToken)
        .catch((err) => console.log(`Could not update refresh token!`));
    });

    (await ringApi.getCameras()).forEach((camera) => {
      camera.onNewDing.subscribe((ding) => {
        const event =
          ding.kind === 'motion' ? 'Motion detected' : ding.kind === 'ding' ? 'Doorbell pressed' : `Video started (${ding.kind})`;

        console.log(`${event} on ${camera.name} camera. Ding id ${ding.id_str}.  Received at ${new Date()}`);
      });
    });
  },
};
