import {
  Component,
  computed,
  Inject,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { appSettings } from '@app/configs';
import { angularFormsModule, angularModule } from '@app/core/modules';
import { fadeAnimation } from '@app/shared/animations';
import { AddRole, EditRole } from '@app/store';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'roles-add-edit',
  standalone: true,
  imports: [angularFormsModule, angularModule],
  templateUrl: './roles-add-edit.component.html',
  styleUrl: './roles-add-edit.component.scss',
  animations: [fadeAnimation],
})
export class RolesAddEditComponent implements OnInit, OnDestroy {
  private _store = inject(Store);
  private _toastr = inject(ToastrService);
  private _formBuilder = inject(FormBuilder);
  private _loadingBar = inject(LoadingBarService);

  public addEditRoleForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  public submitted = signal<boolean>(false);
  public isDisabled = signal<boolean>(false);
  public roleStatus = signal<{ value: number; label: string }[]>([
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ]);

  public pageType = input<string>();
  public selectedRole = input<IRoleList | null>();
  closeSidebar = output<Event>({ alias: 'closeSidebar' });

  constructor() {}

  ngOnInit(): void {
    this.initAddEditRoleForm();
    this.addEditRoleForm.addControl('id', new FormControl(''));
    if (this.pageType() === 'edit') {
      this.patchAddEditRole();
    }
  }

  /**
   * *Initializing form controls in roles form
   */
  private initAddEditRoleForm(): void {
    this.addEditRoleForm = this._formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(appSettings.whitespacePattern),
      ]),
      number_of_employees: new FormControl('', [
        Validators.required,
        Validators.pattern(appSettings.whitespacePattern),
      ]),
      status: new FormControl(1),
    });
  }

  patchAddEditRole() {
    if (this.selectedRole()) {
      this.addEditRoleForm.patchValue({
        id: this.selectedRole()?.id,
        name: this.selectedRole()?.name,
        number_of_employees: this.selectedRole()?.numberOfEmployees,
        status: this.selectedRole()?.status,
      });
    }
  }

  /**
   * *Getting all form controls from roles Form
   *
   * @returns form control
   */
  public formControl = computed(() => this.addEditRoleForm.controls);

  /**
   * *Checking if control has error
   *
   * @param field form control name
   * @returns boolean
   */
  public hasFormControlError(field: string): boolean {
    const control = this.addEditRoleForm.get(field) as FormControl;
    if (
      (this.submitted() && control.errors) ||
      (control.invalid && control.dirty)
    ) {
      return true;
    }
    return false;
  }

  onSubmitAddEditRoleForm(event: Event): boolean | void {
    if (!this.isDisabled()) {
      this.submitted.set(true);
      const formValue = {
        ...this.addEditRoleForm.value,
        number_of_employees: +this.addEditRoleForm.value.number_of_employees,
      };

      // stop here if form is invalid
      if (this.addEditRoleForm.invalid) {
        this.addEditRoleForm.markAllAsTouched();
        return true;
      }

      this.isDisabled.set(true);
      this._loadingBar.useRef().start();
      if (this.pageType() === 'add') {
        this.subscriptions.push(
          this._store.dispatch(new AddRole(formValue)).subscribe({
            next: (apiResult) => {
              this.submitted.set(false);
              this.isDisabled.set(false);
              this._loadingBar.useRef().complete();
              this.onCancelAddRoleForm(event);
            },
            error: (apiError) => {
              this.submitted.set(false);
              this.isDisabled.set(false);
              this._loadingBar.useRef().complete();
              this._toastr.error(apiError.error.response.status.msg, 'error', {
                closeButton: true,
                timeOut: 3000,
              });
            },
          })
        );
      } else {
        this.subscriptions.push(
          this._store.dispatch(new EditRole(formValue)).subscribe({
            next: (apiResult) => {
              this.submitted.set(false);
              this.isDisabled.set(false);
              this._loadingBar.useRef().complete();
              this.onCancelAddRoleForm(event);
            },
            error: (apiError) => {
              this.submitted.set(false);
              this.isDisabled.set(false);
              this._loadingBar.useRef().complete();
              this._toastr.error(apiError.error.response.status.msg, 'error', {
                closeButton: true,
                timeOut: 3000,
              });
            },
          })
        );
      }
    }
  }

  onCancelAddRoleForm(event: Event) {
    this.initAddEditRoleForm();
    this.closeSidebar.emit(event);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
