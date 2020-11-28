const express = require('express');
const app = express();
const port = 3000;
const exphbs = require('express-handlebars');
const { NomineeProvider } = require('./providers/nomineeProvider.js');
const { IMDBProvider } = require('./providers/imdbprovider.js');
const bodyParser = require('body-parser')
const handlebars = require('./helpers/handlebars.js')(exphbs);
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const NomNomProvider = new NomineeProvider();
const imdbProvider = new IMDBProvider();
const allNominees = NomNomProvider.readMoviesFromDisk();


app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.use(express.static('public'))

app.get('/', function(req, res, next) {
    res.render('main', {layout : 'index','allNominees': allNominees});
});

app.get('/getMockObjectForStorage', function(req, res, next) {
    res.json(allNominees);
});

app.get('/getIMDBMetadata', async (req, res, next) => {
	var movieTitles = allNominees.map(y => y.Movies.map(z => z.Name));
	var flattedMovies = [].concat.apply([],movieTitles);

    var allMetadata = await imdbProvider.getIMDBMetadata(flattedMovies);
    console.log(allMetadata);
    res.json(allMetadata);
});

app.post('/writeToDiskFromStorage',jsonParser, function(req, res, next) {
    NomNomProvider.writeMoviesToDisk(req.body);
    res.sendStatus(200);
});

app.listen(port, () => console.log(`App listening to port ${port}`));