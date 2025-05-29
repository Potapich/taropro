FROM node:22-alpine

RUN mkdir -p /opt/nodedbauto/node_modules && chown -R node:node /opt/nodedbauto

WORKDIR /opt/nodedbauto

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

CMD [ "node", "app.js" ]

EXPOSE 8181
