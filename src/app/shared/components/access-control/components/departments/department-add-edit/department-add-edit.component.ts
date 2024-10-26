import {
  Component,
  computed,
  inject,
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
import { LoadingBarService } from '@ngx-loading-bar/core';
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
  private _toastr = inject(ToastrService);
  private _formBuilder = inject(FormBuilder);
  private _loadingBar = inject(LoadingBarService);

  private subscriptions: Subscription[] = [];
  public addEditDepartmentForm!: FormGroup;

  public submitted = signal<boolean>(false);
  public isDisabled = signal<boolean>(false);
  public departmentStatus = signal<{ value: number; label: string }[]>([
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ]);
  closeSidebar = output<Event>({ alias: 'closeSidebar' });

  constructor() {}

  ngOnInit(): void {
    this.initAddEditDepartmentForm();
  }

  /**
   * *Initializing form controls in department form
   */
  private initAddEditDepartmentForm(): void {
    this.addEditDepartmentForm = this._formBuilder.group({
      dept_name: new FormControl('', [
        Validators.required,
        Validators.pattern(appSettings.whitespacePattern),
      ]),
      employee_no: new FormControl('', [
        Validators.required,
        Validators.pattern(appSettings.whitespacePattern),
      ]),
      status: new FormControl(1),
    });
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
      const formValue = this.addEditDepartmentForm.getRawValue();
      console.log(formValue);
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
