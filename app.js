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
const canonicalHost = 'pandemicpictures.info';

app.use(compression());
app.use(ddos.express);
app.use((req, res, next) => {
    const hostname = (req.hostname || '').toLowerCase();
    const shouldRedirectHost = hostname === `www.${canonicalHost}`;
    const shouldRedirectPath = req.path === '/index.html';

    if (!shouldRedirectHost && !shouldRedirectPath) {
        next();
        return;
    }

    const query = req.originalUrl.slice(req.path.length);
    const canonicalPath = shouldRedirectPath ? '/' : req.originalUrl;
    res.redirect(301, `https://${canonicalHost}${canonicalPath}${shouldRedirectPath ? query : ''}`);
});
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

app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.sendFile(path.join(__dirname, 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.sendFile(path.join(__dirname, 'sitemap.xml'));
});


const server = app.listen(port);
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});
