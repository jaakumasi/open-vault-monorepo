import { Response } from "express";
import { BAD_REQUEST, SERVER_ERRORS, STATUS_CODES } from "../constants";
import { ResponseObject } from "../types";

export const userExistsResponseHandler = (res: Response) => {
    res.status(STATUS_CODES.BAD_REQUEST)
        .json(
            {
                statusCode: STATUS_CODES.BAD_REQUEST,
                message: BAD_REQUEST.USER_ALREADY_EXISTS
            } as ResponseObject
        )
}

export const internalServerErrorResponseHandler = (res: Response, message = SERVER_ERRORS.SERVER_ERROR) => {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message
    } as ResponseObject)
}

