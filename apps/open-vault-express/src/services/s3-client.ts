import { S3Client } from '@aws-sdk/client-s3';
import { env } from '../config/env';

export const s3Client = new S3Client({
    region: env.aws.region,
    credentials: {
        accessKeyId: env.aws.accessKeyId,
        secretAccessKey: env.aws.secretAccessKey,
    },
});