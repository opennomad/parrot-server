FROM node:alpine

ADD . .
RUN npm install

ENV PORT=8000
EXPOSE 8000

CMD node app.js
