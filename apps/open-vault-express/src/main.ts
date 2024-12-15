import express, { response } from 'express';
import cors from 'cors';
import formidable from 'formidable';
import { readFileBuffer } from './utils/file-utils';
import { S3Service } from './services/s3.service';
import fs from 'fs';

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

app.post('/upload-file', async (req, res, next) => {
  const form = formidable({});

  try {
    const [_, files] = await form.parse(req);
    const file = files.file?.[0]

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    fs.readFile(file.filepath, async (err, fileBuffer) => {
      if (err) res.status(500).send('could not upload file');

      const s3Service = new S3Service();
      const fileUrl = await s3Service.uploadFile(
        fileBuffer,
        file.originalFilename,
        file.mimetype
      );

      res.json({
        message: 'File uploaded successfully',
        url: fileUrl
      });
    })

  } catch (error) {
    console.log(error.message)
  }
})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
