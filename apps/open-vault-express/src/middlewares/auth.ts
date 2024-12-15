import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { BAD_REQUEST, MIDDLEWARE_ATTACHMENTS, STATUS_CODES } from '../shared/constants';

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
    // const token: string = req.get(HEADERS.AUTHORIZATION)?.split(" ")[1];

    const token = req.cookies['token'];

    if (!token)
        return res.status(STATUS_CODES.UNAUTHORIZED).json({ error: BAD_REQUEST.NO_TOKEN })

    verify(token, process.env.JWT_SECRET, (err: Error, user) => {
        if (err) 
            return res.status(STATUS_CODES.BAD_REQUEST).json({ error: err.message })
        
        req[MIDDLEWARE_ATTACHMENTS.USER] = user;
        next();
    })
}
