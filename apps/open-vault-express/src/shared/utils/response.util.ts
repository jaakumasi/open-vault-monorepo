import { Response } from "express";
import { SERVER_ERRORS } from "../constants";
import { ResponseObject } from "../types";


export const errorResponseHandler = (res: Response, statusCode: number, message: string = SERVER_ERRORS.SERVER_ERROR) => {
    res.status(statusCode).json({
        statusCode,
        message
    } as ResponseObject)
}

