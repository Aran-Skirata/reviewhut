
FROM node:17-alpine3.14

EXPOSE 3000

RUN mkdir -p /usr/src/app 

# VOLUME /user/src/app

WORKDIR /user/src/app/

COPY package.json ./

RUN npm install  \
    npm cache clean --force 

COPY . .

CMD ["node", "index.js"]