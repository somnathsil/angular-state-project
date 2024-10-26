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
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { appSettings } from '@app/configs';
import { angularFormsModule, angularModule } from '@app/core/modules';
import { fadeAnimation } from '@app/shared/animations';
import { LoadingBarService } from '@ngx-loading-bar/core';
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
  closeSidebar = output<Event>({ alias: 'closeSidebar' });

  constructor() {}

  ngOnInit(): void {
    this.initAddEditRoleForm();
  }
  /**
   * *Initializing form controls in roles form
   */
  private initAddEditRoleForm(): void {
    this.addEditRoleForm = this._formBuilder.group({
      id: new FormControl(0),
      role_name: new FormControl('', [
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
      const formValue = this.addEditRoleForm.getRawValue();
      console.log(formValue);
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
