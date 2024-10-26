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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication';
import { CommonService } from '@app/core/services';
import { fadeAnimation } from '@app/shared/animations';
import { passwordValidator } from '@app/shared/validators';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  animations: [fadeAnimation],
})
export class ResetPasswordComponent implements OnInit {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _toastr = inject(ToastrService);
  private _common = inject(CommonService);
  private _formBuilder = inject(FormBuilder);
  private _loader = inject(LoadingBarService);
  private _authService = inject(AuthenticationService);

  public pageType = 1;
  public emailForOtp = '';
  public resetPasswordForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  public submitted = signal<boolean>(false);
  public isDisabled = signal<boolean>(false);
  public showTypePassword = signal<boolean>(false);
  public showTypeConfirmPassword = signal<boolean>(false);
  constructor() {}

  ngOnInit(): void {
    this.initResetPasswordForm();
    this.getEmail();
  }

  getEmail() {
    this._route.queryParamMap.subscribe((param: any) => {
      this.emailForOtp = param.params.email;
      if (this.emailForOtp == undefined) {
        this._router.navigate(['/']);
      }
    });
  }

  /**
   * *Initializing form controls and validation in reset password form
   *
   * @date 1 Sep 2022
   * @developer Somnath Sil
   */
  private initResetPasswordForm() {
    this.resetPasswordForm = this._formBuilder.group(
      {
        new_password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        con_password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      {
        validators: passwordValidator('new_password', 'con_password'),
      }
    );
  }

  /**
   * *Getting all form controls from Login Form
   *
   * @returns form control
   */
  public formControl = computed(() => this.resetPasswordForm.controls);

  /**
   * *Checking if control has error
   *
   * @param field form control name
   * @returns boolean
   */
  public hasFormControlError(field: string): boolean {
    const control = this.resetPasswordForm.get(field) as FormControl;
    if (
      (this.submitted() && control.errors) ||
      (control.invalid && control.dirty)
    ) {
      return true;
    }
    return false;
  }

  resetPasswordSubmit(): boolean | void {
    if (!this.isDisabled()) {
      this.submitted.set(true);
      const formValue = this.resetPasswordForm.getRawValue();

      // stop here if form is invalid
      if (this.resetPasswordForm.invalid) {
        this.resetPasswordForm.markAllAsTouched();
        return true;
      }

      this.isDisabled.set(true);
      const param: IResetPWDParam = {
        email: this.emailForOtp,
        newPassword: formValue.new_password,
        confirmPassword: formValue.con_password,
      };

      this._loader.useRef().start();
      this.subscriptions.push(
        this._authService.resetPassword(param).subscribe({
          next: (apiResult) => {
            this.submitted.set(false);
            this.isDisabled.set(false);
            this._loader.useRef().complete();
            this._toastr.success('Success', apiResult.response.status.message, {
              closeButton: true,
              timeOut: 5000,
            });
            this.pageType = 2;
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

  /**
   * *Password icon toggle
   */
  showIconType(type: number) {
    switch (type) {
      case 0:
        this.showTypePassword.update((type) => {
          return (type = !type);
        });
        break;
      case 1:
        this.showTypeConfirmPassword.update((type) => {
          return (type = !type);
        });
        break;

      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
