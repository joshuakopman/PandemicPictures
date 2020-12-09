#!/bin/bash

cd /home/ec2-user/aws-code-pandemic-pictures && docker build -t joshuakopman/pandemicpictures .
cd /home/ec2-user/aws-code-pandemic-pictures && docker run  -p 80:3000 -p 3000:3000 -d joshuakopman/pandemicpictures