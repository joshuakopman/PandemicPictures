#!/bin/bash

cd /home/ec2-user/aws-code-pandemic-pictures && docker  -D build --progress=plain --no-cache -t joshuakopman/pandemicpictures .