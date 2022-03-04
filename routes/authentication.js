const { request } = require('express');
const express = require('express');
const oauthServer = require('../oauth/server');
const router = express.Router();
const redisClient = require('../config/config').getRedisClient();

router.get(
  '/auth',
  (request, response, next) => {
    redisClient.hGet('user:1', 'ringRefreshToken').then((refreshToken) => {
      if (refreshToken) {
        // multi user currently not implemented!
        response.locals.user = { id: 1 };
        next();
      } else {
        response.sendFile(`${__dirname}/../public/noUser.html`);
      }
    });
  },
  (request, response, next) => {
    if (typeof request.query.continue !== undefined && request.query.continue === 'true') {
      next();
    } else {
      response.send(`
<html>
    <head>
        <link href="//cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <title>Auth API</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1.0,user-scalable=no,viewport-fit=cover" />
    </head>
    <body>
        <div class="container">
            <div class="row justify-content-md-center">
                <div class="col-md-6">
                    <div class="pricing-header p-3 pb-md-4 mx-auto text-center">
                        <h1 class="display-4 fw-normal">Better Ring Integration</h1>
                        <p class="fs-5 text-muted">This project is currently work in progress and multi user is not implemented yet!</p>
                    </div>
                    <div class="alert alert-secondary" role="alert">
                        Read the <a href="https://github.com/pascal20997/better-ring-doorbell/blob/master/README.md" target="_blank">instructions</a> before continue!
                    </div>
                    <a href="${request.originalUrl}&continue=true" class="btn btn-lg btn-primary">Link with Google</a>
                </div>
            </div>
        </div>
    </body>
</html>`);
    }
  },
  oauthServer.authorize({
    authenticateHandler: {
      handle: (request, response) => {
        return response.locals.user;
      },
    },
  }),
);

router.post(
  '/token',
  oauthServer.token({
    // Google recommendation see https://developers.google.com/assistant/identity/oauth2 to prevent
    // user to re-authenticate every time the token expires
    accessTokenLifetime: 315360000,
  }),
);

module.exports = router;
