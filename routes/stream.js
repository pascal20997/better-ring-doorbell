const config = require('../config/config');
const express = require('express');
const cors = require('cors');
const router = express.Router();
const { generateUuid } = require('ring-client-api/lib/api/util');

let sessionUuid;

const corsOptions = {
  origin: 'https://www.gstatic.com',
  optionsSuccessStatus: 200,
};

router.options('/answer', cors(corsOptions));

router.post('/answer', cors(corsOptions), oauthServer.authenticate(), (request, response) => {
  const ringApi = config.getRingApiForUser(response.locals.oauth.token.user);
  ringApi.getCameras().then((cameras) => {
    const camera = cameras.find((c) => c.id === Number(request.body.deviceId));
    switch (request.body.action) {
      case 'offer':
        this.sessionUuid = generateUuid();
        console.log(`Session with uuid "${this.sessionUuid}" started...`);
        return startWebRtcSession(this.sessionUuid, request.body.sdp, camera).then((apiResponse) => {
          response.json({
            action: 'answer',
            sdp: apiResponse,
          });
        });
      case 'end':
        console.log(`Session with uuid "${this.sessionUuid}" ended...`);
        return endWebRtcSession(this.sessionUuid, camera).then((result) => {
          response.json({});
        });
      default:
        response.statusCode = 404;
        return response.json({ error: 'Unknown action!' });
    }
  });
});

// PR: https://github.com/dgreif/ring/pull/862

/**
 * Exchange an Offer SDP for an Answer SDP. Unknown if this endpoint supports trickle with
 * the same session UUID. The Answer SDP advertises trickle. Invalid SDP will result in error
 * 400. Calling this too often will result in what seems to be a soft lockout for 5 minutes,
 * resulting in error 500s.
 * @param session_uuid A session UUID that can be later used to end the WebRTC session.
 * Unknown if stopping the session is actually necessary since WebRTC knows the peer connection state.
 * @param sdp Offer SDP. audio channel must be set to sendrecv.
 * @returns Answer SDP.
 */
async function startWebRtcSession(session_uuid, sdp, camera) {
  const response = await camera.restClient.request({
    method: 'POST',
    url: 'https://api.ring.com/integrations/v1/liveview/start',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: session_uuid,
      device_id: camera.id,
      sdp: sdp,
      protocol: 'webrtc',
    }),
  });
  return response.sdp;
}

async function endWebRtcSession(session_uuid, camera) {
  const response = await camera.restClient.request({
    method: 'POST',
    url: 'https://api.ring.com/integrations/v1/liveview/end',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: session_uuid,
    }),
  });
  return response.sdp;
}

module.exports = router;
