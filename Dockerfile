FROM node:15.3.0

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . /

WORKDIR /pandemic

CMD ["yarn build"]

COPY . /pandemic

WORKDIR /

CMD [ "node", "app.js" ]
