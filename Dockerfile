FROM node:15.3.0

## Create React App Client
##WORKDIR /pandemic

##COPY ["./pandemic/package.json", "./pandemic/package-lock.json*", "./"]

##RUN npm i

##COPY ./pandemic ./ 

##RUN yarn build

##Node Server

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm i 

COPY . /

CMD [ "node", "app.js" ]
