import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { angularModule } from '@app/core/modules';
import { CommonService } from '@app/core/services';
import { fadeAnimation } from '@app/shared/animations';
import { ListFilterComponent } from '@app/shared/components/list-filter/list-filter.component';
import { passwordValidator } from '@app/shared/validators';
import { ChangePassword } from '@app/store/actions/profile.action';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [angularModule, ListFilterComponent, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  animations: [fadeAnimation],
})
export class ChangePasswordComponent implements OnInit {
  public showTypeNew = signal<boolean>(false);
  public showTypeConfirm = signal<boolean>(false);
  public showTypeOld = signal<boolean>(false);
  public submitted = signal<boolean>(false);
  public changePasswordForm!: FormGroup;
  public subscriptions: Subscription[] = [];

  constructor(
    private _common: CommonService,
    private formBuilder: FormBuilder,
    private _store: Store,
    private _toastr: ToastrService,
    private loadingbar: LoadingBarService
  ) {}

  ngOnInit(): void {
    this._common.setLoadingStatus(false);
    this.initializeForm();
  }

  private initializeForm() {
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validators: passwordValidator('newPassword', 'confirmPassword'),
      }
    );
  }

  get formControl() {
    return this.changePasswordForm.controls;
  }

  public hasFormControlError(field: string): boolean {
    const control = this.changePasswordForm.get(field) as FormControl;
    if (
      (this.submitted() && control.errors) ||
      (control.invalid && control.dirty)
    ) {
      return true;
    }
    return false;
  }

  public changePasswordFormSubmit() {
    this.submitted.set(true);
    if (this.changePasswordForm.valid) {
      const param = { ...this.changePasswordForm.getRawValue() };
      this.loadingbar.useRef().start();
      this.subscriptions.push(
        this._store.dispatch(new ChangePassword(param)).subscribe({
          next: () => {
            this.submitted.set(false);
            this.loadingbar.useRef().complete();
            this.changePasswordForm.reset();
          },
          error: (apiError) => {
            this.submitted.set(false);
            this.loadingbar.useRef().complete();
            this._toastr.error(apiError.error.response.status.msg, 'error', {
              closeButton: true,
              timeOut: 3000,
            });
          },
        })
      );
    }
  }

  showIconType(type: string) {
    switch (type) {
      case 'new':
        this.showTypeNew.update((type) => {
          return (type = !type);
        });
        break;
      case 'old':
        this.showTypeOld.update((type) => {
          return (type = !type);
        });
        break;
      case 'confirm':
        this.showTypeConfirm.update((type) => {
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
