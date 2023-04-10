FROM node:15.3.0

## Create React App Client
WORKDIR /pandemic

COPY package.json ./

RUN npm i

COPY ./pandemic /pandemic

run npm install -g create-react-app

run npm i -g react-scripts 

RUN yarn run build

##Node Server

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . /

CMD [ "node", "app.js" ]
