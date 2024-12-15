import express from "express";
import { handleOTPRequest, handlePasswordResetRequest, handleSigninRequest, handleSignupRequest, handleVerifyOTPRequest } from "../services/controller-services/auth.service";
import { validateBody } from "../middlewares/auth";
import { UserAuthDto } from "../dtos/user-auth.dto";
import { VerifyOtpDto } from "../dtos/verify-otp.dto";

const authRouter = express.Router();

authRouter.post('/signin', validateBody(UserAuthDto), handleSigninRequest)
authRouter.post('/signup', handleSignupRequest)
authRouter.post('request-otp', handleOTPRequest)
authRouter.post('/verify-otp', validateBody(VerifyOtpDto), handleVerifyOTPRequest)
authRouter.post('/reset-password', handlePasswordResetRequest)

export default authRouter;
