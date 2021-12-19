FROM node:lts
RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --silent

COPY . .

RUN yarn db:generate
CMD yarn start
