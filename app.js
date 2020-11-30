const express = require('express');
const app = express();
const port = 3000;
const ws = require('ws');
const exphbs = require('express-handlebars');
const { NomineeProvider } = require('./providers/nomineeProvider.js');
const { IMDBProvider } = require('./providers/imdbprovider.js');
const bodyParser = require('body-parser')
const handlebars = require('./helpers/handlebars.js')(exphbs);
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const NomNomProvider = new NomineeProvider();
const imdbProvider = new IMDBProvider();
const allMetadata = imdbProvider.readRatingsFromDisk();
const wsServer = new ws.Server({ noServer: true });

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.use(express.static('public'))

app.get('/', function(req, res, next) {
    res.render('main', {layout : 'index','allNominees': NomNomProvider.readMoviesFromDisk()});
});

app.get('/getMoviesForStorage', function(req, res, next) {
    res.json(NomNomProvider.readMoviesFromDisk());
});

app.post('/writeMoviesToDiskFromStorage',jsonParser, function(req, res, next) {
    NomNomProvider.writeMoviesToDisk(req.body);
	wsServer.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
          client.send('JSONUpdated');
      }
    });    
});

/*
Get IMDB metadata from JSON Store
*/
app.get('/getIMDBForStorage', function(req, res, next) {
    res.json(allMetadata);
});

/*
Get Fresh IMDB metadata from API
*/
app.get('/admin/getIMDBMetadata', async (req, res, next) => {
	var movieTitles = NomNomProvider.readMoviesFromDisk().map(y => y.Movies.map(z => z.Name));
	var flattedMovies = [].concat.apply([],movieTitles);

    var allMetadata = await imdbProvider.getIMDBMetadata(flattedMovies);
    res.json(allMetadata);
});


const server = app.listen(3000);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});