import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.get('/', (req, res) => {
  console.log(__dirname);
  res.send("dir: "+ __dirname +" | " + path.resolve(__dirname, '../pandemic/build', 'index.html'));
  res.sendFile(path.resolve(__dirname, '../pandemic/build', 'index.html'));
});

export default router;
