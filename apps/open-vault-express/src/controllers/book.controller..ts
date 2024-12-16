import express from "express";
import { BookUploadDto as UploadBookDto } from "../dtos/upload-book.dto";
import { validateBody, verifyJWT } from "../middlewares/auth";
import { handleBookSearchRequest, handleDeleteUploadedBookRequest, handleGetBooksRequest, handleGetUploadedBooksOfUserRequest, handlePostBookRequest } from "../services/controller-services/book.service";
import { BookSearchDto } from "../dtos/book-search.dto";

const bookRouter = express.Router();

bookRouter.get('/', handleGetBooksRequest)

bookRouter.post(
    '/upload',
    verifyJWT,
    validateBody(UploadBookDto),
    handlePostBookRequest
)

bookRouter.get(
    '/my-uploads',
    verifyJWT,
    handleGetUploadedBooksOfUserRequest
)

bookRouter.post(
    '/search',
    validateBody(BookSearchDto),
    handleBookSearchRequest
)

bookRouter.delete(
    '/my-uploads/:id',
    verifyJWT,
    handleDeleteUploadedBookRequest
)


export default bookRouter;
