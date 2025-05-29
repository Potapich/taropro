FROM node:22-alpine

RUN mkdir -p /opt/apptaro/node_modules && chown -R node:node /opt/apptaro

WORKDIR /opt/apptaro

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

CMD [ "node", "server/app.js" ]

EXPOSE 8080
