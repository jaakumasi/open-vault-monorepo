import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, NgZone, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActionBtnComponent } from "../../../shared/components/action-btn/action-btn.component";
import { FormControlComponent } from "../../../shared/components/form-control/form-control.component";
import { FormDividerComponent } from "../../../shared/components/form-divider/form-divider.component";
import { GoogleAuthComponent } from "../../../shared/components/google-auth/google-auth.component";
import { InvalidInputMessageComponent } from "../../../shared/components/invalid-input-message/invalid-input-message.component";
import { OpenVaultBannerComponent } from "../../../shared/components/open-vault-banner/open-vault-banner.component";
import { CLIENT_ENDPOINTS, STORAGE_KEYS } from '../../../shared/constants';
import { updateUser } from '../../../shared/store/actions.store';
import { FormSignupRequest, GoogleUser, NonRedirectionResponseData, ResponseObject, SocialSignupRequest, User } from '../../../shared/types';
import { emailValidator } from '../../../shared/validators/email.validator';
import { AuthApiService } from '../shared/services/auth-api.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    ActionBtnComponent,
    ReactiveFormsModule,
    CommonModule,
    GoogleAuthComponent,
    FormDividerComponent,
    FormControlComponent,
    InvalidInputMessageComponent,
    RouterLink,
    OpenVaultBannerComponent
  ],
  templateUrl: './signin.component.html',
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
    decodedUser: GoogleUser | null,
    isSocialSignin: boolean = false
  ) {
    this.onRequestStart();

    let requestBody = null;
    
    if (isSocialSignin) {
      requestBody = {
        email: decodedUser!.email,
        isSocialLogin: true,
        socialLoginProvider: {
          name: decodedUser!.name,
          profilePictureUrl: decodedUser!.picture,
          provider: 'google',
        },
      } as SocialSignupRequest;
    } else {
      const email = this.signinForm.get('email')?.value;
      const password = this.signinForm.get('password')?.value;
      requestBody = {
        email,
        password,
        isSocialLogin: false,
      } as FormSignupRequest;
    }

    /* For users who's OTPs are unverified, the email is required during verification.
     * For form signins, the email would be available in the form's email input.
     * For social signins, it'll be in the decoded user credential obj. */
    const formEmail = this.signinForm.get('email')?.value;
    if (!formEmail) this.saveEmail(decodedUser!.email);
    else this.saveEmail(formEmail);

    this.authApiService.handleSignin(requestBody).subscribe({
      next: (response: object) => {
        this.handleSuccessResponse(response);
      },
      error: (response: HttpErrorResponse) => {
        this.handleErrorResponse(response);
      },
    });
  }

  async handleSuccessResponse(_response: object) {
    this.onRequestEnd();

    const response = _response as ResponseObject;
    this.saveToken(response);
    const user = (response.data as NonRedirectionResponseData).user;
    this.updateStore(user);

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
    globalThis.window?.localStorage.setItem(STORAGE_KEYS.EMAIL, email);
  }

  saveToken(response: ResponseObject) {
    const token = (response.data as NonRedirectionResponseData).token
    globalThis.window?.localStorage.setItem(
      STORAGE_KEYS.TOKEN,
      token
    );
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
