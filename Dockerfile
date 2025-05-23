FROM node:18

## Create React App Client
WORKDIR /pandemic

COPY ["./pandemic/package.json", "./pandemic/package-lock.json*", "./"]

#RUN npm install

COPY ./pandemic ./ 

#RUN yarn build

##Node Server

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . /

CMD [ "node", "app.js" ]
