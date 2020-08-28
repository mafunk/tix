FROM node:alpine

WORKDIR /app
COPY package.json .

RUN yarn --production
COPY . .

CMD ["yarn", "start"]