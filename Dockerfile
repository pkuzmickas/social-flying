FROM node:8-slim

WORKDIR /starter
ENV NODE_ENV development

COPY package.json /starter/package.json

RUN npm install
RUN npm install -g nodemon

COPY .env.example /starter/.env.example
COPY . /starter

CMD ["npm","run","devstart"]

EXPOSE 8080
