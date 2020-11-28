const express = require('express');
const app = express();
const port = 3000;
const exphbs = require('express-handlebars');
const { NomineeProvider } = require('./providers/nomineeProvider.js');

app.set('view engine', 'hbs');


var handlebars = require('./helpers/handlebars.js')(exphbs);

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.render('main', {layout : 'index'});
});

app.get('/mock-movies', function(req, res, next) {
    new NomineeProvider().fetchNomineeMarkup().then((allNominees)=>{
        res.render('main', {layout : 'index','allNominees': allNominees});
    });
});


app.get('/getMockObjectForStorage', function(req, res, next) {
    new NomineeProvider().fetchNomineeMarkup().then((allNominees)=>{
        res.json({'allNominees' : allNominees});
    });
});

app.get('/disk-movies', function(req, res, next) {
    var allNominees = new NomineeProvider().readMoviesFromDisk();
    res.render('main', {layout : 'index','allNominees': allNominees});
});

app.listen(port, () => console.log(`App listening to port ${port}`));