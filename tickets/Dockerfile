FROM node:alpine

ARG NPM_TOKEN
WORKDIR /app

COPY package.json .
COPY .npmrc .

RUN yarn --production
COPY . .

CMD ["yarn", "start"]