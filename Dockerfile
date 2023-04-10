FROM node:15.3.0

## Create React App Client
WORKDIR /pandemic

COPY ./pandemic/package.json ./

COPY ./pandemic/package-lock.json ./

RUN ls -al 

RUN npm i

##copies pandemic folder to docker container current workdir (pandemic folder)
COPY ./pandemic ./ 

RUN ls -al 

RUN yarn run build

##Node Server

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm i 

COPY . /

CMD [ "node", "app.js" ]
