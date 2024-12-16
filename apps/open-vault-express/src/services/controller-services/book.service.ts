import { Request, Response } from "express";
import dataSource from "../../db/data-source";
import { Book } from "../../db/entities/book.entity";
import { BAD_REQUEST, MIDDLEWARE_ATTACHMENTS, STATUS_CODES } from "../../shared/constants";
import { ResponseObject } from "../../shared/types";
import formidable from "formidable";
import { promises as fs } from 'fs';
import { S3Service } from "../s3.service";
import { PdfService } from "../pdf.service";
import { BookUploadDto } from "../../dtos/upload-book.dto";
import { User } from "../../db/entities/user.entity";
import { logger } from "../../shared/utils/logger.util";
import { internalServerErrorResponseHandler } from "../../shared/utils/response.util";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../config/env";
import { setServers } from "dns";

const bookRepo = dataSource.getRepository(Book);
const userRepo = dataSource.getRepository(User);

const RESPONSE_MESSAGES = {
    BOOK_NOT_FOUND: 'No such book found',
    BOOK_DELETION_FAILED: 'Could not delete book',
    FILE_UPLOAD_FAILED: '',
    NO_FILE: 'No file was uploaded',
    BOOK_DELETION_SUCCESSFUL: 'Book deleted successfully',
    ONLY_PDFS_ARE_ALLOWED: 'Only PDF files are allowed',
    UPLOAD_FAILED: 'Failed to upload file. Please try again.',
    UPLOAD_SUCCESS: 'Book uploaded successfully',
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


    // extract book metadata
    let { totalPages, author, title } = await extractBookMetadata(fileBuffer);
    title = fields.title[0] ?? title;
    author = fields.author[0] ?? author
    let description = fields.description[0] ?? 'No description'

    const userEmail = req[MIDDLEWARE_ATTACHMENTS.USER].email;

    try {
        const user = await userRepo.findOne({ where: { email: userEmail } })

        let book = await bookRepo.findOne({ where: { title, author }, relations: ['users'] });

        // Create a book if it doesn't already exist otherwise link the user to the book
        if (!book) {
            book = bookRepo.create({
                title,
                author,
                description,
                totalPages,
                // bookUrl: fileUrl,
                users: [user]
            })

            // upload pdf to S3
            const fileUrl = await uploadFiletoS3Bucket(file, fileBuffer, res);
            if (!fileUrl) return;

            book.bookUrl = fileUrl
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
        internalServerErrorResponseHandler(res, RESPONSE_MESSAGES.UPLOAD_FAILED)
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
        logger(error.message)
        internalServerErrorResponseHandler(res, RESPONSE_MESSAGES.FILE_UPLOAD_FAILED)

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

export const handleGetUploadedBooksOfUserRequest = async (req: Request, res: Response) => {
    const userEmail = req[MIDDLEWARE_ATTACHMENTS.USER].email;
    const user = await userRepo.findOne({ where: { email: userEmail } })
    if (!user) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: BAD_REQUEST.USER_DOES_NOT_EXIST
        } as ResponseObject);
    }

    res.status(STATUS_CODES.OK).json({
        statusCode: STATUS_CODES.OK,
        data: user.books
    } as ResponseObject)
}

export const handleDeleteUploadedBookRequest = async (req: Request, res: Response) => {
    const bookId = req.params.id;

    try {
        const book = await bookRepo.findOne({ where: { id: bookId } })

        if (!book) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                statusCode: STATUS_CODES.BAD_REQUEST,
                message: RESPONSE_MESSAGES.BOOK_NOT_FOUND
            } as ResponseObject);
        }

        const userEmail = req[MIDDLEWARE_ATTACHMENTS.USER].email;
        const user = await userRepo.findOne({ where: { email: userEmail } })

        if (!user) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                statusCode: STATUS_CODES.BAD_REQUEST,
                message: BAD_REQUEST.USER_DOES_NOT_EXIST
            } as ResponseObject);
        }

        const filteredBooks = user.books.filter(book => book.id !== bookId)
        user.books = filteredBooks

        await userRepo.save(user);
        await bookRepo.delete(bookId)

        // delete file from s3
        await deleteFileFromS3Bucket(book.bookUrl, res)

    } catch (error) {
        logger(error.message)
        internalServerErrorResponseHandler(res, RESPONSE_MESSAGES.BOOK_DELETION_FAILED)
    }
}


const deleteFileFromS3Bucket = async (bookUrl: string, res: Response) => {
    // const bookKey = 'uploads/1734242671431-js cheat sheet.pdf'

    /* url format is https://bcuketname.region.amazonaws.com/itemKeyInBucket */
    const bookKey = bookUrl.split('.com/')[1];

    const params = {
        Bucket: env.aws.bucketName,
        Key: bookKey,
    }
    const command = new DeleteObjectCommand(params)

    const s3Service = new S3Service();

    try {
        await s3Service.getS3Client().send(command);

        res.status(STATUS_CODES.OK).json({
            statusCode: STATUS_CODES.OK,
            message: RESPONSE_MESSAGES.BOOK_DELETION_SUCCESSFUL,
        } as ResponseObject)
    } catch (error) {
        logger(error)
        internalServerErrorResponseHandler(res, RESPONSE_MESSAGES.BOOK_DELETION_FAILED)
    }
}
