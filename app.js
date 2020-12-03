const express = require('express');
const app = express();
const port = 3000;
const compression = require('compression')
const fs = require("fs");

const ws = require('ws');
const wsServer = new ws.Server({ noServer: true });

const bodyParser = require('body-parser')

const exphbs = require('express-handlebars');
const handlebars = require('./helpers/handlebars.js')(exphbs);

const imdbRouter = require('./routes/imdb');
const nomineessRouter = require('./routes/nominees');
const adminRouter = require('./routes/admin');

const { NomineeProvider } = require('./providers/nomineeProvider.js');
const NomNomProvider = new NomineeProvider();

app.use(compression())
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
    res.render('main', {layout : 'index','allNominees': NomNomProvider.readMoviesFromDisk()});
});

app.use('/movies', function (req, res, next) {
    req.writeConfig = {
        wsServer: wsServer,
        ws: ws
    };
    next();
}, nomineessRouter);

app.use('/imdb',imdbRouter);
app.use('/admin', adminRouter);


app.get('/admin/addYearsToJSON', async (req, res, next) => {
    var moviesFormatted= NomNomProvider.readMoviesFromDisk().MoviesList.map(y => y.Movies.map(z => { return { "Year": y.Year,"Name" : z.Name} } ));
    var flattedMovies = [].concat.apply([],moviesFormatted);
    
    let raw = fs.readFileSync('./mocks/imdbTestFinal.json');
    let json = JSON.parse(raw);
    var index = 0;
    for(var imdbListing of json) {
        imdbListing.OscarYear = flattedMovies[index].Year;
        index++;
      }
      fs.writeFileSync('./mocks/imdbTestFinal.json', JSON.stringify(json, null, 4));
    //res.json(allMetadata);
});

const server = app.listen(3000);
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});