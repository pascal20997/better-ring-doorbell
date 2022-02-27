const express = require('express');
const router = express.Router();
const { RingApi } = require('ring-client-api');

/**
 * NOT WORKING RIGHT NOW!
 *
 * Testing around to get two way communication between Doorbell and Google Nest Hub
 */

router.post('/answer', (request, response, next) => {
  const ringApi = new RingApi({
    refreshToken: response.locals.oauth.token.user.ringRefreshToken,
    cameraStatusPollingSeconds: 20,
    cameraDingsPollingSeconds: 1,
  });
  ringApi.getCameras().then((cameras) => {
    const camera = cameras.find((c) => c.id === Number(request.body.deviceId));
    switch (request.body.action) {
      case 'answer':
        response.send('ANSWER');
        break;
      case 'offer':
        return camera.restClient
          .request({
            method: 'POST',
            url: camera.doorbotUrl('liveview/start'),
            //body: { protocol: 'webrtc' },
          })
          .then((apiResponse) => {
            console.log(`Response`);
            console.log(apiResponse);
            response.send('DONE');
          });
        /*camera.startVideoOnDemand().then((apiResponse) => {
          // https://account.ring.com/api/cgw/integrations/v1/liveview/start
          console.log(apiResponse);
          response.send('OFFER');
        });*/
        break;
      case 'end':
        response.send('END');
        break;
    }
  });
});

module.exports = router;
