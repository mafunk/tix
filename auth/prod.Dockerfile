FROM node:alpine

ARG NPM_TOKEN
WORKDIR /app

COPY package.json .

RUN yarn --production
COPY . .

RUN yarn build

CMD ["yarn", "run"]