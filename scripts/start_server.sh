#!/bin/bash

docker stop $(docker ps -aq) || echo 'no containers to stop'
docker rm -f $(docker ps -aq) || echo 'no containers to remove'
docker rmi -f $(docker images -aq) || echo 'no images to remove'
cd /home/ec2-user/aws-code-pandemic-pictures && docker build -t joshuakopman/pandemicpictures
cd /home/ec2-user/aws-code-pandemic-pictures && docker run  -p 80:3000 -p 3000:3000 -d joshuakopman/pandemicpictures