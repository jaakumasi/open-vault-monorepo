import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { logger } from '../shared/utils/logger.util';

const mailTransport = () => {
    return nodemailer.createTransport({
        // @ts-ignore
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
}

export const sendMail = async (email: string, otp: number) => {
    try {
        const transport = mailTransport();
        const options: Mail.Options = {
            to: email,
            from: {
                name: process.env.MAIL_NAME,
                address: process.env.MAIL_ADDRESS,
            },
            subject: 'OTP Code',
            html: `Your otp code is: <b>${otp}</b>`,
        };
        transport.sendMail(options, (error) => {
            logger(error.message)
        });
        
    } catch (error) {
        logger(error.message);
    }
}
