#!/bin/bash

docker stop $(docker ps -aq)
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -aq)
docker build -t joshuakopman/pandemicpictures .
docker run  -p 80:3000 -p 3000:3000 -d joshuakopman/pandemicpictures