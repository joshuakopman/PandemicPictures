FROM node:15.3.0

## Create React App Client
WORKDIR /pandemic

COPY ["package.json", "package-lock.json*", "./pandemic"]

CMD ["yarn install"]

COPY pandemic ./

CMD ["yarn build"]

##Node Server

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . /

CMD [ "node", "app.js" ]
