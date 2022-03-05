# Better Ring Integration for Google Actions

Welcome to Better Ring Integration. This project allows you to fully integrate your Ring Doorbell with Google Home products. This is a work in progress project so feel free to post your feedback, ideas and bugs :).

## Features

### Ring Doorbell

The doorbell was the main intention of this project! I hate how unkind Amazon developed the official Ring integration of Google Home. I mean the do not support a doorbell press for a doorbell integration!? I do my best to fix this issue so you don't need an Echo device for that. 

- Doorbell presses are supported using the native way like the Nest Doorbell.
- One way video stream is supported (via WebRTC). Official Google API does not allow two way communication right now!

### Other devices

Currently only the doorbell devices are supported because I don't have any other type of Ring devices right now. Feel free to open a pull request or sending me one over ;) .

## Setup

### Run the NodeJS Application

This part is individual. You can either use Docker and my example docker-compose.yml or just run the app using your own container or native NodeJS (12) package.

#### Using example docker-compose.yml

- Clone the repository with `git clone https://github.com/pascal20997/better-ring-doorbell.git`
- Copy the .docker-compose.yml to docker-compose.yml `cp .docker-compose.yml docker-compose.yml`
- Run `docker-compose build` to build a container with the latest master branch
- Now use `docker-compose up -d`. The example docker-compose file already includes a redis instance for authentication tokens and more.

### Use a Proxy for HTTPS!

You can use [Traefik](https://doc.traefik.io/traefik/getting-started/install-traefik/) if you are using Docker. The example docker-compose file inside this repository contains ready to use configuration for Traefik.

#### Configuration example for the example docker-compose

```
# /opt/container/traefik/docker-compose.yml

version: '3'

services:
  reverse-proxy:
    image: traefik:v2.6
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik.yml:/etc/traefik/traefik.yml
      - ./letsencrypt:/letsencrypt

networks:
  default:
    external:
      name: web
```

```
# /opt/container/traefik/traefik.yml

log:
  level: INFO

api:
  insecure: true
  dashboard: true

entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false

certificatesResolvers:
  lets-encr:
    acme:
      email: notmy@mail.tld
      storage: /letsencrypt/acme.json
      httpChallenge:
        # used during the challenge
        entryPoint: web
```


### Create your own Google Action

- Open [Actions Console](https://console.actions.google.com/u/0/)
- Create a new project
- Select "Smart Home" as category
- Open the Project Settings and copy the project id (three dotted menu item)
- Go back to the Overview
- Name your Smart Home action as you like
- Go back to Overview
- Now go to "Setup account linking", we will continue here later

### Local configuration

- Run the setup.js file. You can use `docker exec -it better-ring-doorbell_app_1 node setup.js` if you are using the example docker-compose file.
- Follow the steps of the setup wizard and write down the client id and client secret! Use the earlier copied Project ID (you get asked during the setup).

### Prepare Account Linking and Fulfillment Path

- Go back to the Actions Console and paste the client id and client secret you configured during the setup process.
- Use `https://YOURDOMAIN.TLD/oauth/auth` as Authorization URL
- Use `https://YOURDOMAIN.TLD/oauth/token` as Token URL 
- Go back to Overview and then "Build your Action" > "Add Action(s)"
- Use `https://YOURDOMAIN.TLD/google-actions/fulfillment` as "Fulfillment URL"
- Save your changes

### Setup notifications

I will add the detailed steps later. Use [this tutorial](https://developers.google.com/assistant/smarthome/develop/notifications#notification-requests) for now to enable Homegraph API and get your credentials json file and copy it to config/google-secret-key.json (see Options below!).

### Deploy the Google Action

Never release the Google Action as this should only be available in your own Account! Go to "Deploy" and "Test". Then "Reset Test". Wait a few minutes and open your Google Home App. Now you are able to add the Integration. It is labeled with "[TEST] your google action name".

## F.A.Q

### Error: Refresh token is not valid. Unable to authenticate with Ring servers.

In this case the refresh token has expired. The server tries to update the token automatically but in case of this message you have to use `npm run refresh-token` to update the refresh token.
