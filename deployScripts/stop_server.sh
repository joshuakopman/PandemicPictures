#!/bin/bash

docker stop $(docker ps -aq) || echo 'no containers to stop'
docker rm -f $(docker ps -aq) || echo 'no containers to remove'
docker rmi -f $(docker images -aq) || echo 'no images to remove'