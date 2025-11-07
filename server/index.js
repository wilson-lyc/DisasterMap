import express from 'express';
import dataRouter from './routes/disaster.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api', dataRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器已启动：http://0.0.0.0:${PORT}`);
});
