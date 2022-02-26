# Better Ring Integration for Google Actions

Welcome to Better Ring Integration. This project allows you to fully integrate your Ring Doorbell with Google Home products. This is a work in progress project so feel free to post your feedback, ideas and bugs :).

> :warning: **This is currently work in progess!**: The release is not finished yet and does not work right now! My goal is to have a BETA ready by the end of March.

# 1. Installation

Clone the repository. Then run

`npm i`

# 2. onfiguration

Take a look into `config/config.js`. This is the default configuration. You can override the default configuration using environment variables.

## Options

| Variable   | Description        | Default |
| ---------- | ------------------ | ------- |
| REDIS_HOST | The redis hostname | redis   |

# 3. Setup

Currently the setup process is a CLI step. Call `npm run setup` or `node setup.js` to start and follow the instructions. I'll add a Web UI Setup later.
