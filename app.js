const express = require('express');
const app = express();
const port = 3000;
const exphbs = require('express-handlebars');
const { NomineeProvider } = require('./providers/nomineeProvider.js');
const bodyParser = require('body-parser')
var handlebars = require('./helpers/handlebars.js')(exphbs);
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.use(express.static('public'))

app.get('/', function(req, res, next) {
    var allNominees = new NomineeProvider().readMoviesFromDisk();
    res.render('main', {layout : 'index','allNominees': allNominees});
});

app.get('/getMockObjectForStorage', function(req, res, next) {
    var allNominees = new NomineeProvider().readMoviesFromDisk();
    res.json(allNominees);
});

app.post('/writeToDiskFromStorage',jsonParser, function(req, res, next) {
    new NomineeProvider().writeMoviesToDisk(req.body);
    res.sendStatus(200);
});

app.listen(port, () => console.log(`App listening to port ${port}`));