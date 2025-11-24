FROM node:18-slim

RUN apt-get update && apt-get update -y && apt-get clean

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9000

CMD [ "npm" , "start" ]