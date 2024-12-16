import express from "express";
import { handleOTPRequest, handlePasswordResetRequest, handleSigninRequest, handleSignupRequest, handleVerifyOTPRequest } from "../services/controller-services/auth.service";
import { validateBody } from "../middlewares/auth";
import { UserAuthDto } from "../dtos/user-auth.dto";
import { VerifyOtpDto } from "../dtos/verify-otp.dto";
import { RequestOtpDto } from "../dtos/request-otp.dto";
import { ResetPasswordDto } from "../dtos/reset-password.dto";

const authRouter = express.Router();

authRouter.post('/signin', validateBody(UserAuthDto), handleSigninRequest)
authRouter.post('/signup', handleSignupRequest)
authRouter.post('/request-otp', validateBody(RequestOtpDto), handleOTPRequest)
authRouter.post('/verify-otp', validateBody(VerifyOtpDto), handleVerifyOTPRequest)
authRouter.post('/reset-password', validateBody(ResetPasswordDto), handlePasswordResetRequest)

export default authRouter;
