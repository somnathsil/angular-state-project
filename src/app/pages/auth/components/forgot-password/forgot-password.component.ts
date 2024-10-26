import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { appSettings } from '@app/configs';
import { AuthenticationService } from '@app/core/authentication';
import { CommonService } from '@app/core/services';
import { fadeAnimation } from '@app/shared/animations';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  animations: [fadeAnimation],
})
export class ForgotPasswordComponent implements OnInit {
  private _router = inject(Router);
  private _toastr = inject(ToastrService);
  private _common = inject(CommonService);
  private _formBuilder = inject(FormBuilder);
  private _loader = inject(LoadingBarService);
  private _authService = inject(AuthenticationService);

  public forgotPasswordForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  public submitted = signal<boolean>(false);
  public isDisabled = signal<boolean>(false);
  public emailError = signal(appSettings.emailPattern);

  constructor() {}

  ngOnInit(): void {
    this._common.setLoadingStatus(false);
    this.initForgotPasswordForm();
  }

  /**
   * *Initializing form controls in forgot password form
   */
  private initForgotPasswordForm(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(this.emailError()),
        ],
      }),
    });
  }

  /**
   * *Getting all form controls from forgot password Form
   *
   * @returns form control
   */
  public formControl = computed(() => this.forgotPasswordForm.controls);

  /**
   * *Checking if control has error
   *
   * @param field form control name
   * @returns boolean
   */
  public hasFormControlError(field: string): boolean {
    const control = this.forgotPasswordForm.get(field) as FormControl;
    if (
      (this.submitted() && control.errors) ||
      (control.invalid && control.dirty)
    ) {
      return true;
    }
    return false;
  }

  onSubmitForgotPassword(): boolean | void {
    if (!this.isDisabled()) {
      this.submitted.set(true);
      const formValue = this.forgotPasswordForm.getRawValue();

      // stop here if form is invalid
      if (this.forgotPasswordForm.invalid) {
        this.forgotPasswordForm.markAllAsTouched();
        return true;
      }

      this.isDisabled.set(true);
      const param: IForgetPasswordParam = {
        email: formValue.email,
      };

      this._loader.useRef().start();
      this.subscriptions.push(
        this._authService.forgetPassword(param).subscribe({
          next: (apiResult) => {
            this.submitted.set(false);
            this.isDisabled.set(false);
            this._loader.useRef().complete();
            this._toastr.success('Success', apiResult.response.status.message, {
              closeButton: true,
              timeOut: 5000,
            });

            setTimeout(() => {
              this._router.navigate(['/enter-otp'], {
                queryParams: { email: formValue.email },
              });
            }, 500);
          },
          error: (apiError) => {
            this.submitted.set(false);
            this.isDisabled.set(false);
            this._loader.useRef().complete();
            this._toastr.error(
              'Error',
              apiError.error.response.status.message,
              {
                closeButton: true,
                timeOut: 5000,
              }
            );
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
