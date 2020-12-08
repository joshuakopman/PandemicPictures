import express from 'express';
import { IMDBProvider } from '../providers/imdbProvider.js';

const router = express.Router();
const imdbProvider = new IMDBProvider();
const allMetadata = imdbProvider.readRatingsFromDisk();

router.get('/', (req, res, next) => {
    res.json(allMetadata);
});


export default router;
