import { hash } from 'bcrypt';
import { NextFunction, Request, Response } from "express";
import dataSource from "../../db/data-source";
import { User } from "../../db/entities/user.entity";
import { UserAuthDto } from "../../dtos/user-auth.dto";
import { BAD_REQUEST, EXPIRY, HASH, REDIRECT_TO, SERVER_ERRORS, STATUS_CODES, SUCCESSFUL_REQUEST } from "../../shared/constants";
import { ResponseObject, VerificationScenario } from "../../shared/types";
import { logger } from "../../shared/utils/logger.util";
import { internalServerErrorResponseHandler } from "../../shared/utils/response.util";
import { createOtpRecord, findOtpByAssociatedMail, verifyOtpCode } from "../otp.service";
import { VerifyOtpDto } from '../../dtos/verify-otp.dto';
import { signToken } from '../../shared/utils/token.util';

const userRepo = dataSource.getRepository(User);

export const handleSigninRequest = async (req: Request, res: Response, next: NextFunction) => {
    const userDto: UserAuthDto = req.body;

    try {
        const user = await findUserByEmail(userDto.email, res);

        /* Bounce non-existent users who's signin method is not with a social provider */
        if (!user && !userDto.isSocialLogin) {
            return res.status(STATUS_CODES.BAD_REQUEST)
                .json(
                    {
                        statusCode: STATUS_CODES.BAD_REQUEST,
                        message: BAD_REQUEST.USER_DOES_NOT_EXIST
                    } as ResponseObject
                )
        }

        /* A user using a social provider to signin for the first time gets signed up. */
        if (!user && userDto.isSocialLogin)
            return handleSignupRequest(req, res, next);

        /* A user needs to be OTP verified for social or form signins.
         * Unverified users regardless of the signin method will be redirected to the OTP verification page */
        if (!user.otpVerified)
            return handleUnverifiedOtpResponse(res, userDto, user);


    } catch (error) {
        logger(error.message)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({
                statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: SERVER_ERRORS.CREATE_USER
            } as ResponseObject)
    }
}

const handleUnverifiedOtpResponse = async (res: Response, userDto: UserAuthDto, user: User) => {
    try {
        /* send OTP to user for email verification */
        await createOtpRecord(user);
    } catch (error) {
        logger(error.message)
        internalServerErrorResponseHandler(res, SERVER_ERRORS.SERVER_ERROR)
    }

    const verificationScenario: VerificationScenario = userDto.isSocialLogin
        ? "socialSignup"
        : "formSignup"

    res.status(STATUS_CODES.BAD_REQUEST).json({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: BAD_REQUEST.UNVERIFIED_OTP,
        data: {
            redirectTo: REDIRECT_TO.OTP_VERIFICATION,
            scenario: verificationScenario,
        }
    } as ResponseObject)
}

/**
  * Bounce signup requests for already existing users.
  * A user signing up with a social provider requires no password but both signups require first time OTP verification.
  * If signup is successful, an OTP is sent to the user's email for verification.
*/
export const handleSignupRequest = async (req: Request, res: Response, next: NextFunction) => {
    const userDto: UserAuthDto = req.body;

    const user = await findUserByEmail(userDto.email, res);

    if (user) {
        return res.status(STATUS_CODES.BAD_REQUEST)
            .json(
                {
                    statusCode: STATUS_CODES.BAD_REQUEST,
                    message: BAD_REQUEST.USER_ALREADY_EXISTS
                } as ResponseObject
            )
    }

    let {
        isSocialLogin: __,
        socialLoginProvider:
        provider,
        email,
        password
    } = req.body as UserAuthDto;
    let userData = {} as Partial<User>;

    if (provider) {
        userData = {
            email,
            socialLoginProvider: {
                name: provider.name,
                profilePicUrl: provider.profilePictureUrl,
                // @ts-ignore
                provider: provider.provider
            }
        }
    }
    else {
        const hashedPassword: string = await hash(password, HASH.SALT_ROUNDS);
        userData = {
            email,
            password: hashedPassword,
        };
    }

    try {
        const newUser = userRepo.create(userData);
        await userRepo.save(newUser);

        /* send OTP to user for email verification */
        await createOtpRecord(newUser);

        res.status(STATUS_CODES.CREATED).json({
            statusCode: STATUS_CODES.CREATED,
            message: SUCCESSFUL_REQUEST.OTP_CREATED,
        } as ResponseObject)
    } catch (error) {
        logger(error.message)
        internalServerErrorResponseHandler(res, error.message)
    }
}

export const findUserByEmail = async (email: string, res: Response) => {
    try {
        const user = await userRepo.findOne({ where: { email } });
        return user;
    } catch (error) {
        logger(error.message)
        internalServerErrorResponseHandler(res, error.message);
    }
}

export const handleOTPRequest = (req: Request, res: Response, next: NextFunction) => {

}

export const handlePasswordResetRequest = (req: Request, res: Response, next: NextFunction) => {

}

/**
  * OTP verification is done during a signup or password reset
  * A successful OTP verification request would return a redirection response either to the
  * #1: sign in page during form signup
  * #2: OTP verification page during social signup
  * #3: password reset page
  */
export const handleVerifyOTPRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { email, verificationScenario } = req.body as VerifyOtpDto;

    const user = await findUserByEmail(email, res)

    if (!user) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: BAD_REQUEST.USER_DOES_NOT_EXIST,
        } as ResponseObject)
    }

    const verificationResponse = await verifyOtpCode(req.body, res)

    let data: { token?: string; redirectTo: string };
    if (verificationScenario === "passwordReset") {
        data = {
            redirectTo: REDIRECT_TO.PASSWORD_RESET,
        };
    }
    else if (verificationScenario === "formSignup") {
        data = {
            redirectTo: REDIRECT_TO.SIGNIN,
        };
    }
    else {
        data = {
            token: await getAuthToken({ email }),
            redirectTo: REDIRECT_TO.HOME,
        };
    }

    res.status(verificationResponse.statusCode).json({
        statusCode: verificationResponse.statusCode,
        message: verificationResponse.message,
        data,
    })
}

const getAuthToken = async (payload: any) => {
    return await signToken(
        payload,
        EXPIRY.ACCESS_TOKEN_EXPIRATION_TIME,
    );
}