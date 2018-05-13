FROM node:carbon
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
RUN npm install -g nodemon
COPY . .
EXPOSE 3000
RUN node seed-taxii-data.js
CMD [ "npm", "start" ]
