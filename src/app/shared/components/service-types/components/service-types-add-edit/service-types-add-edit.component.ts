import {
  Component,
  computed,
  inject,
  input,
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
import {
  angularFormsModule,
  angularModule,
} from '@app/core/modules/angular-module';
import { CommonService } from '@app/core/services';
import { fadeAnimation } from '@app/shared/animations';
import {
  AddServiceType,
  AllServiceTypeList,
  EditServiceType,
} from '@app/store/actions/settings.action';
import { SettingsState } from '@app/store/state/settings.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { mergeMap, Observable, Subscription } from 'rxjs';

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
  private _common = inject(CommonService);
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
  public monthTypes = signal<IMasterMonthList[]>([]);
  public pageType = input<string>();
  public selectedServiceType = input<IServiceTypeList | null>();
  closeSidebar = output<Event>({ alias: 'closeSidebar' });

  serviceTypeMonthList$: Observable<IMasterMonthList[]> = this._store.select(
    SettingsState.monthForServiceTye
  );

  constructor() {}

  ngOnInit(): void {
    // this.getMonthData();
    this.getDataFromStore();
    this.initAddEditServiceTypesForm();
    this.addEditServiceTypesForm.addControl('id', new FormControl(''));
    if (this.pageType() === 'edit') {
      this.patchAddEditServiceType();
    }
  }

  public getDataFromStore() {
    this.subscriptions.push(
      this.serviceTypeMonthList$.subscribe((data) => {
        this.monthTypes.set(data);
      })
    );
  }

  private initAddEditServiceTypesForm(): void {
    this.addEditServiceTypesForm = this._formBuilder.group({
      service_type_name: new FormControl('', [
        Validators.required,
        Validators.pattern(appSettings.whitespacePattern),
      ]),
      service_month: new FormControl('', [Validators.required]),
      status: new FormControl(1),
    });
  }

  patchAddEditServiceType() {
    if (this.selectedServiceType()) {
      this.addEditServiceTypesForm.patchValue({
        id: this.selectedServiceType()?.id,
        service_type_name: this.selectedServiceType()?.service_type_name,
        service_month: this.selectedServiceType()?.service_month,
        status: this.selectedServiceType()?.status,
      });
    }
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
      if (this.pageType() !== 'edit') delete formValue.id;

      const serviceTypeListParam = {
        first: 1,
        rows: 5,
        filters: {
          service_type_name: {
            matchMode: 'startsWith',
            value: '',
          },
          service_month: {
            matchMode: 'eq',
            value: '',
          },
          status: {
            matchMode: 'eq',
            value: '',
          },
        },
        globalFilter: '',
      };

      if (this.addEditServiceTypesForm.valid) {
        this.isDisabled.set(true);
        this._loadingBar.useRef().start();
        if (this.pageType() === 'add') {
          this.subscriptions.push(
            this._store
              .dispatch(new AddServiceType(formValue))
              .pipe(
                mergeMap((x) => {
                  return this._store.dispatch(
                    new AllServiceTypeList(serviceTypeListParam)
                  );
                })
              )
              .subscribe({
                next: (apiResult) => {
                  this.submitted.set(false);
                  this.isDisabled.set(false);
                  this._loadingBar.useRef().complete();
                  this.onCancelAddServiceTypeForm(event);
                },
                error: (apiError) => {
                  this.submitted.set(false);
                  this.isDisabled.set(false);
                  this._loadingBar.useRef().complete();
                  this._toastr.error(
                    apiError.error.response.status.message,
                    'error',
                    {
                      closeButton: true,
                      timeOut: 3000,
                    }
                  );
                },
              })
          );
        } else {
          this.subscriptions.push(
            this._store
              .dispatch(new EditServiceType(formValue))
              .pipe(
                mergeMap((x) => {
                  return this._store.dispatch(
                    new AllServiceTypeList(serviceTypeListParam)
                  );
                })
              )
              .subscribe({
                next: (apiResult) => {
                  this.submitted.set(false);
                  this.isDisabled.set(false);
                  this._loadingBar.useRef().complete();
                  this.onCancelAddServiceTypeForm(event);
                },
                error: (apiError) => {
                  this.submitted.set(false);
                  this.isDisabled.set(false);
                  this._loadingBar.useRef().complete();
                  this._toastr.error(
                    apiError.error.response.status.msg,
                    'error',
                    {
                      closeButton: true,
                      timeOut: 3000,
                    }
                  );
                },
              })
          );
        }
      }
    }
  }

  onCancelAddServiceTypeForm(event: Event) {
    this.initAddEditServiceTypesForm();
    this.closeSidebar.emit(event);
  }

  // getMonthData() {
  //   this._common._monthDataSource$.subscribe({
  //     next: (apiResult) => {
  //       this.monthTypes.set(apiResult);
  //     },
  //   });
  // }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
