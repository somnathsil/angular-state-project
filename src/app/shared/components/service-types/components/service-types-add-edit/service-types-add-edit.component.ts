import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { appSettings } from '@app/configs';
import {
  angularFormsModule,
  angularModule,
} from '@app/core/modules/angular-module';
import { fadeAnimation } from '@app/shared/animations';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-service-types-add-edit',
  standalone: true,
  imports: [angularFormsModule, angularModule],
  templateUrl: './service-types-add-edit.component.html',
  styleUrl: './service-types-add-edit.component.scss',
  animations: [fadeAnimation],
})
export class ServiceTypesAddEditComponent implements OnInit {
  private _store = inject(Store);
  private _toastr = inject(ToastrService);
  private _formBuilder = inject(FormBuilder);
  private _loadingBar = inject(LoadingBarService);

  public addEditServiceTypesForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  public submitted = signal<boolean>(false);
  public isDisabled = signal<boolean>(false);
  public roleStatus = signal<{ value: number; label: string }[]>([
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ]);
  public monthTypes = signal<{ value: number; label: string }[]>([
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ]);

  constructor() {}

  ngOnInit(): void {
    this.initAddEditServiceTypesForm();
  }

  private initAddEditServiceTypesForm(): void {
    this.addEditServiceTypesForm = this._formBuilder.group({
      service_name: new FormControl('', [
        Validators.required,
        Validators.pattern(appSettings.whitespacePattern),
      ]),
      service_month: new FormControl('', [Validators.required]),
      status: new FormControl(1),
    });
  }

  public formControl = computed(() => this.addEditServiceTypesForm.controls);

  public hasFormControlError(field: string): boolean {
    const control = this.addEditServiceTypesForm.get(field) as FormControl;
    if (
      (this.submitted() && control.errors) ||
      (control.invalid && control.dirty)
    ) {
      return true;
    }
    return false;
  }

  onSubmitAddEditServiceTypesForm(event: Event): boolean | void {
    if (!this.isDisabled()) {
      this.submitted.set(true);
      const formValue = this.addEditServiceTypesForm.getRawValue();
      console.log(formValue);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
