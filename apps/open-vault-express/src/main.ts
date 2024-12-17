import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import "reflect-metadata";
import authRouter from './controllers/auth.controller';
import bookRouter from './controllers/book.controller.';
import dataSource from './db/data-source';
import { logger } from './shared/utils/logger.util';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send({ message: 'ping success' });
});

dataSource.initialize().then(() => {
  logger('db connection established')
})
  .catch(e => logger(e.message))


app.use('/api/v1/auth', authRouter);

app.use('/api/v1/books', bookRouter);


app.listen(port, () => {
  logger(`listening on port ${port}`);
});
