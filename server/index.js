import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dataRouter from './routes/disaster.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use('/api', dataRouter);

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Started, running on http://localhost:${PORT}`);
});