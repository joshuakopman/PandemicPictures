FROM node:15.3.0

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . /

CMD [ "node", "app.js" ]
