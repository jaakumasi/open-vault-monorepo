import express, { response } from 'express';
import cors from 'cors';
import formidable from 'formidable';
import { readFileBuffer } from './shared/utils/file';
import { S3Service } from './services/s3.service';
import { promises as fs } from 'fs';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from './config/env';
import { PdfService } from './services/pdf.service';
import path from 'path';
import "reflect-metadata";
import dataSource from './db/data-source';
import authRouter from './controllers/auth.controller';
import { verifyJWT } from './middlewares/auth';
import { logger } from './shared/utils/logger.util';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json())

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
  const form = formidable({ keepExtensions: true });

  try {
    const [_, files] = await form.parse(req);
    const file = files.file?.[0]

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    const fileBuffer = await fs.readFile(file.filepath)

    const s3Service = new S3Service();

    // upload pdf
    // const fileUrl = await s3Service.uploadFile(
    //   fileBuffer,
    //   file.originalFilename,
    //   file.mimetype
    // );

    const pdfService = new PdfService();
    // const { title, author, coverImageBuffer } = await pdfService.extractPdfInfo(fileBuffer);
    const { totalPages, author, title } = await pdfService.extractPdfInfo(fileBuffer);
    // const coverImageUrl = await s3Service.uploadFile(
    //   coverImageBuffer,
    //   `${title}-cover.png`,
    //   'image/jpg',
    //   'covers'
    // );

    // res.json({
    //   message: 'File uploaded successfully',
    //   // pdf: fileUrl,
    //   cover: coverImageUrl
    // });

  } catch (error) {
    console.log(error.message)
    res.status(500).send('could not upload file');
  }
})

app.use('/api/v1/auth', authRouter);

/* JWT Auth middleware for routes requiring authorization */
app.use(verifyJWT)


app.listen(port, () => {
  logger(`listening on port ${port}`);
});
