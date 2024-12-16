import { Routes } from "@angular/router";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { VerifyOtpComponent } from "./verify-otp/verify-otp.component";
import { RequestOtpComponent } from "./request-otp/request-otp.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";

export const AuthRoutes: Routes = [
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'request-otp', component: RequestOtpComponent },
    { path: 'verify-otp/:scenario', component: VerifyOtpComponent },
    { path: 'password-reset', component: PasswordResetComponent },
];
