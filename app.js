import express from 'express';
import compression from 'compression';
import ws from 'ws';
import bodyParser from "body-parser";
import exphbs from 'express-handlebars';
import { default as hbsHelpers } from './helpers/hbsHelpers.js';
import imdbRouter from './routes/imdb.js';
import nomineessRouter from './routes/nominees.js';
import adminRouter from './routes/admin.js';
import { NomineeProvider } from './providers/nomineeProvider.js';

const app = express();
const port = 3000;
const NomNomProvider = new NomineeProvider();
const wsServer = new ws.Server({ noServer: true });
const handlebars = hbsHelpers(exphbs);

app.use(compression())
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
    res.render('main', {layout : 'index','allNominees': NomNomProvider.readMoviesFromDisk()});
});

app.use('/movies', (req, res, next) => {
    req.writeConfig = {
        wsServer: wsServer,
        ws: ws
    };
    next();
}, nomineessRouter);

app.use('/imdb',imdbRouter);
app.use('/admin', adminRouter);

const server = app.listen(port);
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});