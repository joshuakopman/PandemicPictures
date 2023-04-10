FROM node:15.3.0

## Create React App Client
WORKDIR /pandemic

COPY package*.json ./

RUN yarn install

COPY ./pandemic /pandemic

RUN yarn run build

##Node Server

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . /

CMD [ "node", "app.js" ]
