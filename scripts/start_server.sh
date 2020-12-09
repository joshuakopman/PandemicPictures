#!/bin/bash

sudo docker stop $(docker ps -aq) || echo 'no containers to stop'
sudo docker rm -f $(docker ps -aq) || echo 'no containers to remove'
sudo docker rmi -f $(docker images -aq) || echo 'no images to remove'
cd ..
sudo docker build -t joshuakopman/pandemicpictures .  || echo 'no images to build'
sudo docker run  -p 80:3000 -p 3000:3000 -d joshuakopman/pandemicpictures || echo 'no containers to run'