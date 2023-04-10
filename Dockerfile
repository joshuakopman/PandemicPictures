FROM node:15.3.0

## Create React App Client
WORKDIR /pandemic

COPY package.json ./

COPY package-lock.json ./

RUN npm i

COPY ./pandemic /pandemic

run npm i -g react-scripts 

RUN yarn run build

##Node Server

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . /

CMD [ "node", "app.js" ]
