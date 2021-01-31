#!/bin/bash

cd /home/ec2-user/aws-code-pandemic-pictures &&vdocker run -d -p 80:3000 -p 3000:3000 -v /home/ec2-user/movieRatingsDataStore/movies_Josh_Alicia.json:/mocks/movies_Josh_Alicia.json -v /home/ec2-user/movieRatingsDataStore/movies_Zak_Neas.json:/mocks/movies_Zak_Neas.json joshuakopman/pandemicpictures