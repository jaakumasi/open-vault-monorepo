import { Request, Response } from "express";
import dataSource from "../../db/data-source";
import { Book } from "../../db/entities/book.entity";
import { MIDDLEWARE_ATTACHMENTS, STATUS_CODES } from "../../shared/constants";
import { ResponseObject } from "../../shared/types";
import formidable from "formidable";
import { promises as fs } from 'fs';
import { S3Service } from "../s3.service";
import { PdfService } from "../pdf.service";
import { BookUploadDto } from "../../dtos/book-upload.dto";
import { User } from "../../db/entities/user.entity";
import { logger } from "../../shared/utils/logger.util";

const bookRepo = dataSource.getRepository(Book);
const userRepo = dataSource.getRepository(User);

const RESPONSE_MESSAGES = {
    FILE_UPLOAD_FAILED: '',
    NO_FILE: 'No file was uploaded',
    ONLY_PDFS_ARE_ALLOWED: 'Only PDF files are allowed',
    UPLOAD_FAILED: 'Failed to upload file. Please try again.',
    UPLOAD_SUCCESS: 'Book uploaded successfully'
}

export const handleGetBooksRequest = async (req: Request, res: Response) => {
    const books = await bookRepo.find();
    res.status(STATUS_CODES.OK).json({
        statusCode: STATUS_CODES.OK,
        data: books
    } as ResponseObject)
}

export const handlePostBookRequest = async (req: Request, res: Response) => {
    //get uploaded file and its buffer
    const formidableUploadBreakdown = await getUploadedFileBuffer(req, res);
    if (!formidableUploadBreakdown) return;
    const { file, fields, fileBuffer } = formidableUploadBreakdown;

    // upload pdf to S3
    const fileUrl = await uploadFiletoS3Bucket(file, fileBuffer, res);
    if (!fileUrl) return;

    // extract book metadata
    const { totalPages, author, title } = await extractBookMetadata(fileBuffer);


    const userEmail = req[MIDDLEWARE_ATTACHMENTS.USER].email;

    try {
        const user = await userRepo.findOne({ where: { email: userEmail } })

        let book = await bookRepo.findOne({ where: { title, author }, relations: ['users'] });

        // Create a book if it doesn't already exist otherwise link the user to the book
        if (!book) {
            book = bookRepo.create({
                title: fields.title[0] ?? title,
                author: fields.author[0] ?? author,
                description: fields.description[0] ?? 'No description',
                totalPages,
                bookUrl: fileUrl,
                users: [user]
            })
        }
        else if (!book.users.some(existingUser => existingUser.id === user.id)) {
            book.users.push(user);
        }

        await userRepo.save(user);
        await bookRepo.save(book);

        res.status(STATUS_CODES.CREATED).json({
            statusCode: STATUS_CODES.CREATED,
            message: RESPONSE_MESSAGES.UPLOAD_SUCCESS,
        } as ResponseObject);

    } catch (error) {
        logger(error.message);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: RESPONSE_MESSAGES.UPLOAD_FAILED
        } as ResponseObject);
    }
}

const getUploadedFileBuffer = async (req: Request, res: Response) => {
    const form = formidable({ keepExtensions: true });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0]

    if (!file) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: RESPONSE_MESSAGES.NO_FILE
        } as ResponseObject);

        return null;
    }

    if (file.mimetype !== 'application/pdf') {
        res.status(STATUS_CODES.BAD_REQUEST).json({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: RESPONSE_MESSAGES.ONLY_PDFS_ARE_ALLOWED
        } as ResponseObject);

        return null;
    }

    const fileBuffer = await fs.readFile(file.filepath);

    return {
        file, fields, fileBuffer
    }
}

const uploadFiletoS3Bucket = async (file: formidable.File, fileBuffer: Buffer, res: Response) => {
    const s3Service = new S3Service();

    let fileUrl: string = '';
    try {
        fileUrl = await s3Service.uploadFile(
            fileBuffer,
            file.originalFilename,
            file.mimetype
        );
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: RESPONSE_MESSAGES.FILE_UPLOAD_FAILED
        })

        return null;
    }

    return fileUrl;
}

const extractBookMetadata = async (fileBuffer: Buffer) => {
    const pdfService = new PdfService();

    try {
        const { totalPages, author, title } = await pdfService.extractPdfInfo(fileBuffer);

        return {
            totalPages: totalPages.toString(),
            title,
            author
        }
    } catch (error) {
        return {
            totalPages: 'Unknown page count',
            title: 'Unknown Title',
            author: 'Unknown Author'
        };
    }
}

