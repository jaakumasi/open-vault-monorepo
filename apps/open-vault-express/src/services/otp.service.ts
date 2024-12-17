import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import dataSource from "../db/data-source";
import { Otp } from "../db/entities/otp.entity";
import { User } from "../db/entities/user.entity";
import { VerifyOtpDto } from "../dtos/verify-otp.dto";
import { BAD_REQUEST, EXPIRY, STATUS_CODES, SUCCESSFUL_REQUEST } from "../shared/constants";
import { ResponseObject } from "../shared/types";
import { logger } from "../shared/utils/logger.util";
import { signToken, verifyToken } from "../shared/utils/token.util";
import { findUserByEmail } from "./controller-services/auth.service";
import { sendMail } from "./mail.service";

const otpRepo = dataSource.getRepository(Otp)

const userRepo = dataSource.getRepository(User)


/**
 * A new OTP record is created if only it doesn't already exist.
 * An existing record is updated with the new signed OTP.
 */
export const createOtpRecord = async (user: User) => {
    try {
        const otpRecord = await findOtpByAssociatedMail(user.email);

        const signedOtp = await generateOtpCode(user.email)

        if (otpRecord) {
            await otpRepo.update(otpRecord.id, { code: signedOtp })
        }
        else {
            const newOtpRecord = otpRepo.create({
                email: user.email,
                code: signedOtp,
                user
            })

            await otpRepo.save(newOtpRecord)
        }
    } catch (error) {
        logger(error.message)
        throw new Error(error)
    }
}

export const findOtpByAssociatedMail = async (email: string) => {
    try {
        return await otpRepo.findOne({ where: { email } })
    } catch (error) {
        throw new Error(error)
    }
}


/**
 * Verifies the OTP for password reset requests or unverifed users during signup. A verified OTP record is then deleted.
 * Users can only verify using the OTP sent to their mail.
 * If the verification request is during signup, provide response if the user is already OTP verified.
 */
export const verifyOtpCode = async (body: VerifyOtpDto, res: Response) => {
    const { email, otp, verificationScenario } = body;

    try {
        const user = await findUserByEmail(email, res);

        const otpRecord = await findOtpByAssociatedMail(email)
        if (!otpRecord)
            return {
                statusCode: STATUS_CODES.BAD_REQUEST,
                message: BAD_REQUEST.REQUEST_OTP
            } as ResponseObject;

        /* Users can't validate with OTPs that are not theirs */
        if (email !== otpRecord.email) {
            return {
                statusCode: STATUS_CODES.BAD_REQUEST,
                message: BAD_REQUEST.MISMATCHING_OTP
            } as ResponseObject;;
        }
        /* Can't request for OTP verification if its not `password reset` request and
         * and user is already OTP verified */
        if (
            verificationScenario !== "passwordReset" &&
            user.otpVerified
        ) {
            return {
                statusCode: STATUS_CODES.BAD_REQUEST,
                message: BAD_REQUEST.ALREADY_VALIDATED,
            } as ResponseObject;;
        }

        const decodedOtp = await verifyToken(otpRecord.code) as JwtPayload

        if (otp == decodedOtp.otp) {
            await userRepo.update(user.id, {
                otpVerified: true
            })

            await otpRepo.delete(otpRecord.id);

            return {
                statusCode: STATUS_CODES.ACCEPTED,
                message: SUCCESSFUL_REQUEST.VALID_OTP,
            } as ResponseObject;
        }
        else {
            return {
                statusCode: STATUS_CODES.BAD_REQUEST,
                message: BAD_REQUEST.INVALID_OTP,
            }
        }

    } catch (error) {
        logger(error.message)
        throw new Error(error);
    }
}

const generateOtpCode = async (email: string): Promise<string> => {
    let otp = Math.floor(Math.random() * 10000);
    if (otp.toString().length < 4) otp += 1000;
    /* mail the unsigned OTP to the user before signing */
    await sendMail(email, otp)
    return signOtp(otp);
}

const signOtp = async (otp: string | number): Promise<string> => {
    return signToken({ otp }, EXPIRY.OTP_EXPIRATION_TIME)
}


