# Better Ring Integration for Google Actions

Welcome to Better Ring Integration. This project allows you to fully integrate your Ring Doorbell with Google Home products. This is a work in progress project so feel free to post your feedback, ideas and bugs :).

> :warning: **This is currently work in progress!**: The release is not finished yet and does not work right now! My goal is to have a BETA ready by the end of March.

# 1. Installation

Clone the repository. Then run

`npm i`

# 3. Setup

Currently the setup process is a CLI step. Call `npm run setup` or `node setup.js` to start and follow the instructions. I'll add a Web UI Setup later.

## Additonal required steps

- Copy .env.example to .env and adjust the redis host and port if you need.
- I will add the detailed steps later. Use [this tutorial](https://developers.google.com/assistant/smarthome/develop/notifications#notification-requests) for now to enable Homegraph API and get your credentials json file and copy it to config/google-secret-key.json (see Options below!).

## Options

| Variable   | Description        | Default |
| ---------- | ------------------ | ------- |
| REDIS_HOST | The redis hostname                               | redis   |
| REDIS_PORT | The redis port                                   | 6379    |
| GOOGLE_APPLICATION_CREDENTIALS | Credentials JSON from Google | /app/config/google-secret-key.json |

# F.A.Q

## Error: Refresh token is not valid. Unable to authenticate with Ring servers.

In this case the refresh token has expired. The server tries to update the token automatically but in case of this message you have to use `npm run refresh-token` to update the refresh token.
