#!/bin/bash

cd /home/ec2-user/aws-code-pandemic-pictures && docker run -d -p 80:3000 -p 3000:3000 -v /home/ec2-user/movieRatingsDataStore/:/mocks/ joshuakopman/pandemicpictures