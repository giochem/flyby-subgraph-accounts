# syntax=docker/dockerfile:1

FROM node:18-alpine
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ["package.json", "./"]

RUN pnpm install 

COPY . .

EXPOSE 4001


CMD [ "npm", "run", "start" ]   