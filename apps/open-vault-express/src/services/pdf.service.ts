import pdfParse from 'pdf-parse';
import { logger } from '../shared/utils/logger.util';

export class PdfService {
    async extractPdfInfo(fileBuffer: Buffer) {
        try {
            const pdfData = await pdfParse(fileBuffer);

            const totalPages = pdfData.numpages;

            const { Title, Author } = pdfData.info;

            return {
                totalPages,
                title: Title || 'Unknown Title',
                author: Author || 'Unknown Author'
            };

        } catch (error) {
            logger(error.message)
            throw error;
        }
    }
}