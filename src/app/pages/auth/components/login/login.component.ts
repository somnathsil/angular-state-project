import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { appSettings } from '@app/configs';
import { fadeAnimation } from '@app/shared/animations';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/core/authentication';
import { Router, RouterModule } from '@angular/router';
import { HttpService } from '@app/core/http';
import { CookieService } from 'ngx-cookie-service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '@app/core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeAnimation],
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  private _router = inject(Router);
  private _toastr = inject(ToastrService);
  private _common = inject(CommonService);
  private _formBuilder = inject(FormBuilder);
  private _loader = inject(LoadingBarService);
  private _cookieService = inject(CookieService);
  private _authService = inject(AuthenticationService);

  public loginForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  public showType = signal<boolean>(false);
  public submitted = signal<boolean>(false);
  public isDisabled = signal<boolean>(false);
  public emailError = signal(appSettings.emailPattern);
  public rememberMe = signal(appSettings.rememberKey);

  constructor() {}

  ngOnInit(): void {
    this.initLoginForm();
    this.onRememberMe();
  }

  ngAfterViewInit() {
    this._common.setLoadingStatus(false);
  }

  /**
   * *Initializing form controls in login form
   */
  private initLoginForm(): void {
    this.loginForm = this._formBuilder.group({
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(this.emailError()),
        ],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      rememberMe: new FormControl(false, {
        nonNullable: true,
      }),
    });
  }

  /**
   * *Getting all form controls from Login Form
   *
   * @returns form control
   */
  public formControl = computed(() => this.loginForm.controls);

  /**
   * *Checking if control has error
   *
   * @param field form control name
   * @returns boolean
   */
  public hasFormControlError(field: string): boolean {
    const control = this.loginForm.get(field) as FormControl;
    if (this.submitted() && (control.errors || control.invalid)) {
      return true;
    }
    return false;
  }

  onSubmitLogin(): boolean | void {
    if (!this.isDisabled()) {
      this.submitted.set(true);
      const formValue = this.loginForm.getRawValue();

      // stop here if form is invalid
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        return true;
      }

      this.isDisabled.set(true);
      const param: IAuthParam = {
        email: formValue.email,
        password: formValue.password,
      };
      this._loader.useRef().start();
      this.subscriptions.push(
        this._authService.authenticate(param, formValue.rememberMe).subscribe({
          next: (apiResult) => {
            const authData: IAuthResponse = apiResult.response.dataset;
            this.submitted.set(false);
            this.isDisabled.set(false);
            this._loader.useRef().complete();
            this._toastr.success('Success', apiResult.response.status.message, {
              closeButton: true,
              timeOut: 5000,
            });
            this._router.navigateByUrl('/dashboard');
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
   * *If user checked Remember Me
   *
   */
  private onRememberMe() {
    let rememberMeData!: IAuthParam;
    const storedData: string = this._cookieService.get(this.rememberMe());

    if (storedData !== '') {
      rememberMeData = JSON.parse(storedData);
    }

    //Setting values to login form
    if (rememberMeData !== undefined && rememberMeData) {
      this.loginForm.patchValue({
        email: rememberMeData.email,
        password: rememberMeData.password,
        rememberMe: true,
      });
    }
  }

  /**
   * *Password icon toggle
   */
  showIconType() {
    this.showType.update((type) => {
      return (type = !type);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
