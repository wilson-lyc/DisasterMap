import express from 'express';
import dataRouter from './routes/data.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api', dataRouter);

app.listen(PORT, () => {
  console.log(`服务器已启动：http://localhost:${PORT}`);
});
