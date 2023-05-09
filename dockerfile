FROM node:18-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add tzdata
RUN npm i -g node-gyp
RUN npm i

COPY . .

EXPOSE 3000
 
CMD ["node". "index.js"]