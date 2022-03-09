
FROM node:17-alpine3.14

EXPOSE 3000

RUN mkdir -p /usr/src/app 

WORKDIR /usr/src/app/

COPY package.json ./

RUN npm install  \
    npm cache clean --force 

COPY . .

CMD ["node", "index.js"]

