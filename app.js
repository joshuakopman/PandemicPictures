import express from 'express';
import compression from 'compression';
import Ddos from 'ddos';
import ws from 'ws';
import bodyParser from "body-parser";
import exphbs from 'express-handlebars';
import hbsHelpers from './helpers/hbsHelpers.js';
import imdbRouter from './routes/imdb.js';
import nomineesRouter from './routes/nominees.js';
import adminRouter from './routes/admin.js';
import dashboardRouter from './routes/dashboard.js';
import { NomineeProvider } from './providers/nomineeProvider.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;
const wsServer = new ws.Server({ noServer: true });
const ddos = new Ddos({ burst: 50, limit: 500, maxexpiry: 300, trustProxy: false, includeUserAgent: false })

app.use(compression());
app.use(ddos.express);
app.engine('hbs', exphbs(
    {
        extname: '.hbs',
        helpers: hbsHelpers(exphbs).helpers
    }
));
app.set('view engine', 'hbs');
app.use("/public", express.static('public'))
app.use('/mocks', express.static('mocks'));
app.use(bodyParser.json())
app.use('/dashboard', dashboardRouter); // new react main app page
app.use("/static", express.static(path.join(__dirname, 'pandemic/build/static'))); // new React static assets

app.get('/', (req, res, next) => {
    var movies = new NomineeProvider(req.query.userOne, req.query.userTwo).readMoviesFromDisk();
    if (movies == null) {
        res.render('main', { layout: 'error', message: req.query.userOne + ' and ' + req.query.userTwo + "!" });
    } else {
        movies.MoviesList = [];
        res.render('main', { layout: 'index', 'allNominees': movies });
    }
});

app.use('/movies', (req, res, next) => {
    req.writeConfig = {
        wsServer: wsServer,
        ws: ws
    };
    next();
}, nomineesRouter);

app.use('/reactMovies', (req, res, next) => {
    req.writeConfig = {
        wsServer: wsServer,
        ws: ws
    };
    next();
}, nomineesRouter);

app.use('/imdb', imdbRouter);
app.use('/admin', adminRouter);


const server = app.listen(port);
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});