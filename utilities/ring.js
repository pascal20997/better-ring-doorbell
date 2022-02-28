const { RingApi } = require('ring-client-api');

function RingUtility(user) {
  this.ringApi = new RingApi({
    refreshToken: user.ringRefreshToken,
    cameraStatusPollingSeconds: 20,
    cameraDingsPollingSeconds: 1,
  });
}

RingUtility.prototype.getAllDevices = function () {
  let result = [];
  return this.ringApi.fetchRingDevices().then((devices) => {
    devices.doorbots.forEach((camera) => {
      result.push({
        id: camera.id,
        type: 'action.devices.types.DOORBELL',
        traits: ['action.devices.traits.CameraStream', 'action.devices.traits.ObjectDetection'],
        name: { name: camera.description },
        willReportState: true,
        notificationSupportedByAgent: true,
        attributes: {
          cameraStreamSupportedProtocols: [/*'hls',*/ 'webrtc'],
        },
        deviceInfo: {
          manufacturer: 'Better Ring Integration by kronova.net',
          model: camera.model,
          hwVersion: 1.0,
          swVersion: camera.firmware_version,
        },
      });
    });
    return result;
  });
};

// devices = google payload.devices object [{id: ...}, {id: ...}]
RingUtility.prototype.getQueryResult = function (devices) {
  let result = {};
  let deviceIds = [];
  return this.ringApi.fetchRingDevices().then((ringDevices) => {
    ringDevices.doorbots.forEach((camera) => {
      deviceIds.push(camera.id);
    });
    devices.forEach((device) => {
      const deviceFound = deviceIds.includes(Number(device.id));
      result[device.id] = {
        status: deviceFound ? 'SUCCESS' : 'ERROR',
        online: deviceFound ? true : false,
      };
    });
    return result;
  });
};

RingUtility.prototype.getExecuteResult = function (command, request) {
  switch (command.execution[0].command) {
    case 'action.devices.commands.GetCameraStream':
      return this._commandGetCameraStream(command, request);
    default:
      return undefined;
  }
};

RingUtility.prototype._commandGetCameraStream = function (command, request) {
  const deviceId = Number(command.devices[0].id);
  return this.ringApi.getCameras().then((cameras) => {
    const device = cameras.find((camera) => camera.id === deviceId);
    return {
      commands: [
        {
          ids: [command.devices[0].id],
          status: 'SUCCESS',
          states: {
            online: true,
            cameraStreamSignalingUrl: `https://${request.headers.host}/stream/answer`,
          },
        },
      ],
    };
  });
};

module.exports = RingUtility;
