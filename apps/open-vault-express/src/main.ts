import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import "reflect-metadata";
import { env } from './config/env';
import authRouter from './controllers/auth.controller';
import bookRouter from './controllers/book.controller.';
import dataSource from './db/data-source';
import { verifyJWT } from './middlewares/auth';
import { S3Service } from './services/s3.service';
import { logger } from './shared/utils/logger.util';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send({ message: 'ping success' });
});

dataSource.initialize().then(() => {
  console.log('db connection established')
})
  .catch(e => console.log(e.message))

app.delete('/pdf', async (req, res) => {
  const key = 'uploads/1734242671431-js cheat sheet.pdf'

  // if (!key) {
  //   return res.status(400).json({ error: 'No key provided' });
  // }

  const s3Service = new S3Service();

  const params = {
    Bucket: env.aws.bucketName,
    Key: key,
  }
  const command = new DeleteObjectCommand(params)

  // try {
  //   await s3Client.send(command);
  //   res.json({ message: 'File deleted successfully' });
  // } catch (error) {
  //   console.log(error.message)
  //   res.status(500).send('Error deleting file');
  // }
})

app.post('/upload-file', async (req, res, next) => {
  
})

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/books', bookRouter);

/* JWT Auth middleware for routes requiring authorization */
app.use(verifyJWT)

// app.use('/api/v1/upload-book', )



app.listen(port, () => {
  logger(`listening on port ${port}`);
});
