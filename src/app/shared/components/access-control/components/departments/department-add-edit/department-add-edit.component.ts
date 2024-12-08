import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { appSettings } from '@app/configs';
import { angularFormsModule, angularModule } from '@app/core/modules';
import { fadeAnimation } from '@app/shared/animations';
import { AddDepartment, EditDepartment } from '@app/store';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'department-add-edit',
  standalone: true,
  imports: [angularFormsModule, angularModule],
  templateUrl: './department-add-edit.component.html',
  styleUrl: './department-add-edit.component.scss',
  animations: [fadeAnimation],
})
export class DepartmentAddEditComponent implements OnInit, OnDestroy {
  private _store = inject(Store);
  private _toastr = inject(ToastrService);
  private _formBuilder = inject(FormBuilder);
  private _loadingBar = inject(LoadingBarService);

  public addEditDepartmentForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  public submitted = signal<boolean>(false);
  public isDisabled = signal<boolean>(false);
  public departmentStatus = signal<{ value: number; label: string }[]>([
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ]);

  public pageType = input<string>();
  public selectedDepartment = input<IDepartmentList | null>();
  closeSidebar = output<Event>({ alias: 'closeSidebar' });

  constructor() {}

  ngOnInit(): void {
    this.initAddEditDepartmentForm();
    if (this.pageType() === 'edit') {
      this.addEditDepartmentForm.addControl('id', new FormControl(''));
      this.patchAddEditDepartment();
    }
  }

  /**
   * *Initializing form controls in department form
   */
  private initAddEditDepartmentForm(): void {
    this.addEditDepartmentForm = this._formBuilder.group({
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

  patchAddEditDepartment() {
    if (this.selectedDepartment()) {
      this.addEditDepartmentForm.patchValue({
        id: this.selectedDepartment()?.id,
        name: this.selectedDepartment()?.name,
        number_of_employees: this.selectedDepartment()?.numberOfEmployees,
        status: this.selectedDepartment()?.status,
      });
    }
  }

  /**
   * *Getting all form controls from department Form
   *
   * @returns form control
   */
  public formControl = computed(() => this.addEditDepartmentForm.controls);

  /**
   * *Checking if control has error
   *
   * @param field form control name
   * @returns boolean
   */
  public hasFormControlError(field: string): boolean {
    const control = this.addEditDepartmentForm.get(field) as FormControl;
    if (
      (this.submitted() && control.errors) ||
      (control.invalid && control.dirty)
    ) {
      return true;
    }
    return false;
  }

  onSubmitAddEditDepartmentForm(event: Event): boolean | void {
    if (!this.isDisabled()) {
      this.submitted.set(true);
      const formValue = {
        ...this.addEditDepartmentForm.value,
        number_of_employees:
          +this.addEditDepartmentForm.value.number_of_employees,
      };
      if (this.addEditDepartmentForm.invalid) {
        this.addEditDepartmentForm.markAllAsTouched();
        return true;
      }

      this.isDisabled.set(true);
      this._loadingBar.useRef().start();
      if (this.pageType() === 'add') {
        this.subscriptions.push(
          this._store.dispatch(new AddDepartment(formValue)).subscribe({
            next: (apiResult) => {
              this.submitted.set(false);
              this.isDisabled.set(false);
              this._loadingBar.useRef().complete();
              this.onCancelAddDepartmentForm(event);
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
          this._store.dispatch(new EditDepartment(formValue)).subscribe({
            next: (apiResult) => {
              this.submitted.set(false);
              this.isDisabled.set(false);
              this._loadingBar.useRef().complete();
              this.closeSidebar.emit(event);
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

  onCancelAddDepartmentForm(event: Event) {
    this.initAddEditDepartmentForm();
    this.closeSidebar.emit(event);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
