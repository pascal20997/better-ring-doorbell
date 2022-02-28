# Better Ring Integration for Google Actions

Welcome to Better Ring Integration. This project allows you to fully integrate your Ring Doorbell with Google Home products. This is a work in progress project so feel free to post your feedback, ideas and bugs :).

> :warning: **This is currently work in progress!**: The release is not finished yet and does not work right now! My goal is to have a BETA ready by the end of March.

# 1. Installation

Clone the repository. Then run

`npm i`

# 2. Configuration

Take a look into `config/config.js`. This is the default configuration. You can override the default configuration using environment variables.

## Options

| Variable   | Description        | Default |
| ---------- | ------------------ | ------- |
| REDIS_HOST | The redis hostname | redis   |

# 3. Setup

Currently the setup process is a CLI step. Call `npm run setup` or `node setup.js` to start and follow the instructions. I'll add a Web UI Setup later.

# F.A.Q

## Error: Refresh token is not valid. Unable to authenticate with Ring servers.

In this case the refresh token has expired. The server tries to update the token automatically but in case of this message you have to use `npm run refresh-token` to update the refresh token.
