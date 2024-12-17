import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { BAD_REQUEST, MIDDLEWARE_ATTACHMENTS, REQUEST_HEADERS, STATUS_CODES } from '../shared/constants';
import { logger } from '../shared/utils/logger.util';
import { errorResponseHandler } from '../shared/utils/response.util';

export function validateBody<T>(type: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const instance = plainToInstance(type, req.body);
        const errors = await validate(instance as object);

        if (errors.length > 0) {
            const formattedErrors = errors.reduce((acc, error) => {
                acc[error.property] = Object.values(error.constraints || {}).join(', ');
                return acc;
            }, {} as Record<string, string>);

            return res.status(STATUS_CODES.BAD_REQUEST).json({ error: formattedErrors });
        }

        req.body = instance;
        next();
    };
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {

    try {
        // const token: string = req.cookies[COOKIES.ACCESS_TOKEN]
        const token: string = req.get(REQUEST_HEADERS.AUTHORIZATION)?.split(" ")[1];

        if (!token)
            return errorResponseHandler(res, STATUS_CODES.UNAUTHORIZED)

        verify(token, process.env.JWT_SECRET, (err: Error, user) => {
            if (err)
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message })

            req[MIDDLEWARE_ATTACHMENTS.USER] = user;
            next();
        })
    } catch (error) {
        logger(error.message)
        errorResponseHandler(res, STATUS_CODES.UNAUTHORIZED, BAD_REQUEST.NO_OR_INVALID_TOKEN)
    }
}
