# Pandemic Pictures

Pandemic Pictures is an application for Josh and Alicia to track the Best Picture noms they've seen in order to stave off insanity during COVID winter.

## Installation

For local development: ```npm i && npm run start:local```

For local development with watch via nodemon: ```npm i && npm run start:local:watch```

In production, use ```npm start``` or build & run via included Dockerfile in project root:

```
docker build -t pandemicpictures .
docker run -d -p 80:3000 -p 3000:3000  -v /path/to/movieRatingsDataStore/:/mocks/ pandemicpictures
```

## Usage


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
