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
import { appSettings } from '@app/configs';
import { AuthenticationService } from '@app/core/authentication';
import { CommonService } from '@app/core/services';
import { fadeAnimation } from '@app/shared/animations';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-enter-otp',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './enter-otp.component.html',
  styleUrl: './enter-otp.component.scss',
  animations: [fadeAnimation],
})
export class EnterOtpComponent implements OnInit {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _toastr = inject(ToastrService);
  private _common = inject(CommonService);
  private _formBuilder = inject(FormBuilder);
  private _loader = inject(LoadingBarService);
  private _authService = inject(AuthenticationService);

  public emailForOtp = '';
  public enterOtpForm!: FormGroup;
  private subscriptions: Subscription[] = [];
  public submitted = signal<boolean>(false);
  public isDisabled = signal<boolean>(false);

  constructor() {
    this._route.queryParamMap.subscribe((param: any) => {
      this.emailForOtp = param.params.email;
      if (this.emailForOtp == undefined) {
        this._router.navigate(['/']);
      }
    });
  }

  ngOnInit(): void {
    this.initEnterOtpForm();
  }

  /**
   * *Initializing form controls and validation in enter otp form
   *
   * @date 13 Sep 2022
   * @developer Somnath Sil
   */
  private initEnterOtpForm() {
    this.enterOtpForm = this._formBuilder.group({
      otp1: new FormControl('', [Validators.required]),
      otp2: new FormControl('', [Validators.required]),
      otp3: new FormControl('', [Validators.required]),
      otp4: new FormControl('', [Validators.required]),
      otp5: new FormControl('', [Validators.required]),
      otp6: new FormControl('', [Validators.required]),
    });
  }

  /**
   * *Getting all form controls from enter otp Form
   *
   * @returns form control
   */
  public formControl = computed(() => this.enterOtpForm.controls);

  /**
   * *Checking if control has error
   *
   * @param field form control name
   * @returns boolean
   */
  public hasFormControlError(field: string): boolean {
    const control = this.enterOtpForm.get(field) as FormControl;
    if (
      (this.submitted() && control.errors) ||
      (control.invalid && control.dirty)
    ) {
      return true;
    }
    return false;
  }

  enterOtpSubmit(): boolean | void {
    if (!this.isDisabled()) {
      this.submitted.set(true);
      const formValue =
        this.enterOtpForm.get('otp1')?.value +
        this.enterOtpForm.get('otp2')?.value +
        this.enterOtpForm.get('otp3')?.value +
        this.enterOtpForm.get('otp4')?.value +
        this.enterOtpForm.get('otp5')?.value +
        this.enterOtpForm.get('otp6')?.value;

      // stop here if form is invalid
      if (this.enterOtpForm.invalid) {
        this.enterOtpForm.markAllAsTouched();
        return true;
      }

      this.isDisabled.set(true);
      const param: IOtpParam = {
        email: this.emailForOtp,
        otp: formValue,
      };

      this._loader.useRef().start();
      this.subscriptions.push(
        this._authService.enterOTP(param).subscribe({
          next: (apiResult) => {
            this.submitted.set(false);
            this.isDisabled.set(false);
            this._loader.useRef().complete();
            this._toastr.success('Success', apiResult.response.status.message, {
              closeButton: true,
              timeOut: 5000,
            });
            setTimeout(() => {
              // This email is set for use in reset password page
              this._router.navigate(['/reset-password'], {
                queryParams: { email: this.emailForOtp },
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

  resendOTP(event: Event) {
    event.preventDefault();
    this.isDisabled.set(true);
    const param: IResendOtpParam = {
      email: this.emailForOtp,
    };
    this._loader.useRef().start();
    this.subscriptions.push(
      this._authService.resendOTP(param).subscribe({
        next: (apiResult) => {
          this.isDisabled.set(false);
          this._loader.useRef().complete();
          this._toastr.success('Success', apiResult.response.status.message, {
            closeButton: true,
            timeOut: 5000,
          });
        },
        error: (apiError) => {
          this.isDisabled.set(false);
          this._loader.useRef().complete();
          this._toastr.error('Error', apiError.error.response.status.message, {
            closeButton: true,
            timeOut: 5000,
          });
        },
      })
    );
  }

  move(fromtext: any, totext: any, event: any, index: number) {
    const key = event.key;
    if (key === 'Backspace' || key === 'Delete') {
      fromtext.focus();
    } else {
      var length: any = fromtext.length;
      var maxlength: any = fromtext.getAttribute(maxlength);
      if (length == maxlength) {
        totext.focus();
      } else {
        totext.blur();
      }
    }
  }

  /**
   * *Unsubscribing observable on destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
