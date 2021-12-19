FROM node:lts
RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --silent
RUN yarn db:generate

COPY . .

CMD yarn start
