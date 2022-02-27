const RingUtility = require('../utilities/ring');
const { smarthome } = require('actions-on-google');
const app = smarthome();
const express = require('express');
const router = express.Router();

let ringUtility;
let user;
let request;

app.onExecute((body, headers) => {
  return this.ringUtility.getExecuteResult(body.inputs[0].payload.commands[0], this.request).then((payload) => {
    return {
      requestId: body.requestId,
      payload: payload,
    };
  });
});

app.onQuery((body, headers) => {
  return this.ringUtility.getQueryResult(body.inputs[0].payload.devices).then((devicePayload) => {
    return {
      requestId: body.requestId,
      payload: {
        devices: devicePayload,
      },
    };
  });
});

app.onSync((body, headers) => {
  return this.ringUtility.getAllDevices().then((devices) => {
    return {
      requestId: body.requestId,
      payload: {
        agentUserId: this.user.id,
        devices: devices,
      },
    };
  });
});

router.post('/fulfillment', app);

const initialize = (request, response, next) => {
  this.ringUtility = new RingUtility(response.locals.oauth.token.user);
  this.user = response.locals.oauth.token.user;
  this.request = request;
  return router(request, response, next);
};

module.exports = initialize;
