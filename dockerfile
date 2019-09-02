# syntax=docker/dockerfile:1

FROM node:lts

WORKDIR /app

COPY package.json /app/

RUN npm install

CMD [ "npm", "start" ]