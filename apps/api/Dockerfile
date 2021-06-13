FROM node:12-alpine
WORKDIR /usr/fn-gql
COPY package.json .
COPY tsconfig.docker.json tsconfig.json
RUN npm install && npm install typescript -g
COPY src .
RUN tsc
CMD ["node", "./index.js"]