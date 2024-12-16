import express from "express";
import { validateBody, verifyJWT } from "../middlewares/auth";
import { handleGetBooksRequest, handlePostBookRequest } from "../services/controller-services/book.service";
import { BookUploadDto } from "../dtos/book-upload.dto";

const bookRouter = express.Router();

bookRouter.get('/', handleGetBooksRequest)
bookRouter.post('/upload', verifyJWT, validateBody(BookUploadDto), handlePostBookRequest)


export default bookRouter;
