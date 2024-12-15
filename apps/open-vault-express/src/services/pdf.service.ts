import pdfParse from 'pdf-parse';

export class PdfService {
    async extractPdfInfo(fileBuffer: Buffer) {
        try {
            const pdfData = await pdfParse(fileBuffer);

            console.log(pdfData)

            const totalPages = pdfData.numpages;

            const { Title, Author } = pdfData.info;

            return {
                totalPages,
                title: Title || 'Unknown Title',
                author: Author || 'Unknown Author'
            };

        } catch (error) {
            console.error('Error converting PDF to image buffer:', error);
            throw error;
        }
    }
}