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
import { HttpService } from '@app/core/http';
import { CommonService } from '@app/core/services';
import { fadeAnimation } from '@app/shared/animations';
import { passwordValidator } from '@app/shared/validators';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  animations: [fadeAnimation],
})
export class RegistrationComponent implements OnInit {
  private _router = inject(Router);
  private _http = inject(HttpService);
  private _common = inject(CommonService);
  private _formBuilder = inject(FormBuilder);
  private _toastr = inject(ToastrService);
  private _loader = inject(LoadingBarService);
  private _authService = inject(AuthenticationService);

  public submitted = signal<boolean>(false);
  public isDisabled = signal<boolean>(false);
  public showTypePassword = signal<boolean>(false);
  public showTypeConfirmPassword = signal<boolean>(false);
  public emailValidator = signal(appSettings.emailPattern);

  public registrationForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    this._common.setLoadingStatus(false);
    this.initRegistrationForm();
  }

  /**
   * *Initializing form controls and validation in registration form
   *
   * @date 12 Sep 2022
   * @developer Somnath Sil
   */
  private initRegistrationForm() {
    this.registrationForm = this._formBuilder.group(
      {
        name: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern(/^([^0-9]*)$/)],
        }),
        email: new FormControl('', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.pattern(this.emailValidator()),
          ],
        }),
        new_password: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
        con_password: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
        terms: [false, Validators.requiredTrue],
      },
      {
        validators: passwordValidator('new_password', 'con_password'),
      }
    );
  }

  /**
   * *Getting all form controls from registration Form
   *
   * @returns form control
   */
  public formControl = computed(() => this.registrationForm.controls);

  /**
   * *Checking if control has error
   *
   * @param field form control name
   * @returns boolean
   */
  public hasFormControlError(field: string): boolean {
    const control = this.registrationForm.get(field) as FormControl;
    if (this.submitted() && (control.errors || control.invalid)) {
      return true;
    }
    return false;
  }

  registrationSubmit(): boolean | void {
    if (!this.isDisabled()) {
      this.submitted.set(true);
      const formValue = this.registrationForm.getRawValue();

      if (this.registrationForm.invalid) {
        this.registrationForm.markAllAsTouched();
        return false;
      }

      this.isDisabled.set(true);
      const param: IRegistrationParam = {
        name: formValue.name,
        email: formValue.email,
        password: formValue.new_password,
        confirmPassword: formValue.con_password,
      };

      this._loader.useRef().start();
      this.subscriptions.push(
        this._authService.registration(param).subscribe({
          next: (apiResult: any) => {
            console.log(apiResult);
            this.submitted.set(false);
            this.isDisabled.set(false);

            this._loader.useRef().complete();
            this._toastr.success('Success', apiResult.response.status.message, {
              closeButton: true,
              timeOut: 5000,
            });
            this._router.navigateByUrl('/');
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
