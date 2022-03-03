const config = require('../config/config');
const { google } = require('googleapis');

/**
 * This is working for one user only. Do we really need multiple users on one instance?
 */

const homegraphClient = google.homegraph({
  version: 'v1',
  auth: new google.auth.GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/homegraph',
  }),
});

const sendNotification = (deviceId) => {
  console.log(`Send notication to doorbell...`);
  const timestamp = Math.floor(Date.now() / 1000);
  const res = homegraphClient.devices
    .reportStateAndNotification({
      requestBody: {
        agentUserId: '1',
        eventId: 'doorbell_press',
        requestId: 'doorbell_press',
        payload: {
          devices: {
            notifications: {
              [deviceId]: {
                ObjectDetection: {
                  objects: {
                    unclassified: 1,
                  },
                  priority: 0,
                  detectionTimestamp: timestamp,
                },
              },
            },
          },
        },
      },
    })
    .then((response) => {
      console.log(`Response:`);
      console.log(response);
    });
};

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
        if (ding.kind === 'ding') {
          sendNotification(camera.id);
        }
        if (ding.kind === 'motion') {
          const motionTime = new Date().toTimeString();
          console.log(`Motion detected ${motionTime}...`);
        }
      });
    });
  },
};
