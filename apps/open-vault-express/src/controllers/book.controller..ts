import express from "express";
import { BookUploadDto as UploadBookDto } from "../dtos/upload-book.dto";
import { validateBody, verifyJWT } from "../middlewares/auth";
import { handleDeleteUploadedBookRequest, handleGetBooksRequest, handleGetUploadedBooksOfUserRequest, handlePostBookRequest } from "../services/controller-services/book.service";

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

bookRouter.delete(
    '/my-uploads/:id',
    verifyJWT, 
    handleDeleteUploadedBookRequest
)


export default bookRouter;
