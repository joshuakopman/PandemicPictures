#!/bin/bash

cd /home/ec2-user/aws-code-pandemic-pictures && docker run -d -p 80:3000 -p 3000:3000 \
-v /home/ec2-user/movieRatingsDataStore/movies_Josh_Alicia.json:/mocks/movies_Josh_Alicia.json \
-v /home/ec2-user/movieRatingsDataStore/movies_Zak_Neas.json:/mocks/movies_Zak_Neas.json \
-v /home/ec2-user/movieRatingsDataStore/movies_Steve_Allie.json:/mocks/movies_Steve_Allie.json \
-v /home/ec2-user/movieRatingsDataStore/movies_Marc_Joanne.json:/mocks/movies_Marc_Joanne.json \
joshuakopman/pandemicpictures