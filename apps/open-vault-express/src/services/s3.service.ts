import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../config/env";
import { s3Client } from "./s3-client.service";

export class S3Service {
    generateKey(fileName, directory = 'uploads') {
        return `${directory}/${Date.now()}-${fileName}`;
    }

    generatePublicUrl(key) {
        return `https://${env.aws.bucketName}.s3.${env.aws.region}.amazonaws.com/${key}`;
    }

    async uploadFile(fileBuffer: any, fileName: string, mimeType: string, directory = 'uploads') {
        const key = this.generateKey(fileName, directory);

        const params = {
            Bucket: env.aws.bucketName,
            Key: key,
            Body: fileBuffer,
            ContentType: mimeType,
        };
        const command = new PutObjectCommand(params);

        try {
            await s3Client.send(command);
            return this.generatePublicUrl(key);
        } catch (error) {
            throw new Error(`S3 upload failed: ${error.message}`);
        }
    }
}