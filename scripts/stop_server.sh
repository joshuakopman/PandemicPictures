#!/bin/bash

docker stop $(docker ps -aq) || echo 'no containers to stop'