import express from 'express';
import { IMDBProvider } from '../providers/imdbProvider.js';

const router = express.Router();
const imdbProvider = new IMDBProvider();

router.get('/', (req, res, next) => {
    var allMetadata = imdbProvider.readRatingsFromDisk(req.query.limit, req.query.skip);
    res.json(allMetadata);
});


export default router;
