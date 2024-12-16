import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, NgZone, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActionBtnComponent } from "../../../shared/components/action-btn/action-btn.component";
import { FormControlComponent } from "../../../shared/components/form-control/form-control.component";
import { FormDividerComponent } from "../../../shared/components/form-divider/form-divider.component";
import { GoogleAuthComponent } from "../../../shared/components/google-auth/google-auth.component";
import { InvalidInputMessageComponent } from "../../../shared/components/invalid-input-message/invalid-input-message.component";
import { CLIENT_ENDPOINTS, STORAGE_KEYS } from '../../../shared/constants';
import { updateUser } from '../../../shared/store/actions.store';
import { FormSignupRequest, GoogleUser, ResponseObject, SocialSignupRequest, User } from '../../../shared/types';
import { emailValidator } from '../../../shared/validators/email.validator';
import { AuthApiService } from '../shared/services/auth-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    GoogleAuthComponent,
    FormDividerComponent,
    FormControlComponent,
    ActionBtnComponent,
    InvalidInputMessageComponent
  ],
  templateUrl: './signin.component.html',
  providers: [AuthApiService]
})
export class SigninComponent implements OnInit {
  router = inject(Router);
  store = inject(Store);
  formBuilder = inject(FormBuilder);
  authApiService = inject(AuthApiService);
  ngZone = inject(NgZone);

  signinForm!: FormGroup;
  isSubmitEnabled = signal(false);
  isMakingRequest = signal(false);
  showHttpErrorResponse = signal(false);
  httpErrorMessage = signal('');

  ngOnInit(): void {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.signinForm?.valueChanges.subscribe(() =>
      this.isSubmitEnabled.set(this.signinForm.valid)
    );
  }

  onRequestStart() {
    this.isMakingRequest.set(true);
    this.showHttpErrorResponse.set(false);
    this.isSubmitEnabled.set(false);
  }

  onRequestEnd() {
    this.isMakingRequest.set(false);
    this.isSubmitEnabled.set(true);
  }

  onSignin(
    encodedUserCredentials: { credential: string; client_id: string } | null,
    isSocialSignin: boolean = false
  ) {
    this.onRequestStart();

    let requestBody: SocialSignupRequest | FormSignupRequest | {} = {};
    let decodedUser: GoogleUser;
    if (isSocialSignin) {
      decodedUser = this.decodeCredentials(encodedUserCredentials!);
      requestBody = {
        email: decodedUser.email,
        isSocialLogin: true,
        socialLoginProvider: {
          name: decodedUser.name,
          profilePictureUrl: decodedUser.picture,
          provider: 'google',
        },
      };
    } else {
      const email = this.signinForm.get('email')?.value;
      const password = this.signinForm.get('password')?.value;
      requestBody = {
        email,
        password,
        isSocialLogin: false,
      };
    }

    /* For users who's OTPs are unverified, the email is required during verification.
     * For form signins, the email would be available in the form's email input.
     * For social signins, it'll be in the decoded user credential obj. */
    const formEmail = this.signinForm.get('email')?.value;
    if (!formEmail) this.saveEmail(decodedUser!.email);
    else this.saveEmail(formEmail);

    this.authApiService.handleSignin(requestBody).subscribe({
      next: (response: any) => {
        this.handleSuccessResponse(response);
      },
      error: (response: HttpErrorResponse) => {
        this.handleErrorResponse(response);
      },
    });
  }

  async handleSuccessResponse(response: ResponseObject) {
    this.onRequestEnd();

    const redirectTo = response.data?.redirectTo;
    this.updateStore(response.data?.user!);

    await this.router.navigateByUrl(`/${CLIENT_ENDPOINTS.HOME}`);
  }

  async handleErrorResponse(response: HttpErrorResponse) {
    const message = response.error.message;
    const redirectTo = response.error.data?.redirectTo;
    const scenario = response.error.data?.scenario;

    /* form the url based on whether a verification scenario is present in the response */
    let url = scenario && redirectTo ? [redirectTo, scenario] : [redirectTo];
    if (redirectTo) {
      await this.router.navigate(url, {
        queryParams: { message },
      });
      return;
    }

    this.onRequestEnd();
    this.showHttpErrorResponse.set(true);
    this.httpErrorMessage.set(message);
  }

  updateStore(user: User) {
    console.log(user);
    this.store.dispatch(updateUser({ user }));
  }

  saveEmail(email: string) {
    globalThis.localStorage.setItem(STORAGE_KEYS.EMAIL, email);
  }

  decodeCredentials(credentials: {
    credential: string;
    client_id: string;
  }): GoogleUser {
    const payload = credentials.credential.split('.')[1];
    return JSON.parse(atob(payload));
  }

  get emailRequired() {
    return (
      this.signinForm.get('email')?.touched &&
      this.signinForm.get('email')?.hasError('required')
    );
  }

  get emailPatternInvalid() {
    return (
      this.signinForm.get('email')?.touched &&
      this.signinForm.get('email')?.hasError('email')
    );
  }

  get passwordRequired() {
    return (
      this.signinForm.get('password')?.touched &&
      this.signinForm.get('password')?.hasError('required')
    );
  }

  get passwordTooShort() {
    return (
      this.signinForm.get('password')?.touched &&
      this.signinForm.get('password')?.hasError('minlength')
    );
  }

}
