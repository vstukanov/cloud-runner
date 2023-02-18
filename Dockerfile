FROM node:18

WORKDIR /src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn run prebuild && yarn run build

EXPOSE 8080

CMD [ "yarn", "start" ]
