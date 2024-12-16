import { Routes } from "@angular/router";
import { SigninComponent } from "./signin/signin.component";

export const AuthRoutes: Routes = [
    { path: 'signin', component: SigninComponent },
    //   { path: 'signup', component: SignupComponent },
    //   { path: 'verify-otp/:scenario', component: VerifyOtpComponent },
];
