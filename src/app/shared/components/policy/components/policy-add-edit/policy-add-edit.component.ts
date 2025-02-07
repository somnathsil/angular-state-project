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
import { angularFormsModule, angularModule } from '@app/core/modules';
import { fadeAnimation } from '@app/shared/animations';
import { appSettings } from '@app/configs';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { mergeMap, Subscription } from 'rxjs';
import {
  AddPolicy,
  AllPolicyList,
  EditPolicy,
} from '@app/store/actions/settings.action';

@Component({
  selector: 'app-policy-add-edit',
  standalone: true,
  imports: [angularFormsModule, angularModule],
  templateUrl: './policy-add-edit.component.html',
  styleUrl: './policy-add-edit.component.scss',
  animations: [fadeAnimation],
})
export class PolicyAddEditComponent implements OnInit {
  private _store = inject(Store);
  private _toastr = inject(ToastrService);
  private _formBuilder = inject(FormBuilder);
  private _loadingBar = inject(LoadingBarService);

  public addEditPolicyForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  public submitted = signal<boolean>(false);
  public isDisabled = signal<boolean>(false);
  public roleStatus = signal<{ value: number; label: string }[]>([
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ]);

  public pageType = input<string>();
  public selectedProlicyType = input<IPolicyList | null>();
  closeSidebar = output<Event>({ alias: 'closeSidebar' });

  constructor() {}

  ngOnInit(): void {
    this.initAddEditPolicyForm();
    this.addEditPolicyForm.addControl('id', new FormControl(''));
    if (this.pageType() === 'edit') {
      this.patchAddEditPloicy();
    }
  }

  /**
   * *Initializing form controls in policy form
   */
  private initAddEditPolicyForm(): void {
    this.addEditPolicyForm = this._formBuilder.group({
      policy_name: new FormControl('', [
        Validators.required,
        Validators.pattern(appSettings.whitespacePattern),
      ]),
      status: new FormControl(1),
    });
  }

  patchAddEditPloicy() {
    if (this.selectedProlicyType()) {
      this.addEditPolicyForm.patchValue({
        id: this.selectedProlicyType()?.id,
        policy_name: this.selectedProlicyType()?.policy_name,
        status: this.selectedProlicyType()?.status,
      });
    }
  }

  /**
   * *Getting all form controls from policy Form
   *
   * @returns form control
   */
  public formControl = computed(() => this.addEditPolicyForm.controls);

  /**
   * *Checking if control has error
   *
   * @param field form control name
   * @returns boolean
   */
  public hasFormControlError(field: string): boolean {
    const control = this.addEditPolicyForm.get(field) as FormControl;
    if (
      (this.submitted() && control.errors) ||
      (control.invalid && control.dirty)
    ) {
      return true;
    }
    return false;
  }

  onSubmitAddEditPolicyForm(event: Event): boolean | void {
    if (!this.isDisabled()) {
      this.submitted.set(true);
      const formValue = {
        ...this.addEditPolicyForm.value,
      };
      const policyListListParam = {
        first: 1,
        rows: 5,
        filters: {
          policy_name: {
            matchMode: 'startsWith',
            value: '',
          },
          updated_at: {
            matchMode: 'before',
            value: '',
          },
          status: {
            matchMode: 'eq',
            value: '',
          },
        },
        globalFilter: '',
      };

      if (this.pageType() !== 'edit') delete formValue.id;

      if (this.addEditPolicyForm.invalid) {
        // stop here if form is invalid
        this.addEditPolicyForm.markAllAsTouched();
        return true;
      }

      this.isDisabled.set(true);
      this._loadingBar.useRef().start();
      if (this.pageType() === 'add') {
        this.subscriptions.push(
          this._store
            .dispatch(new AddPolicy(formValue))
            .pipe(
              mergeMap((x) => {
                return this._store.dispatch(
                  new AllPolicyList(policyListListParam)
                );
              })
            )
            .subscribe({
              next: (apiResult) => {
                this.submitted.set(false);
                this.isDisabled.set(false);
                this._loadingBar.useRef().complete();
                this.onCancelAddPolicyForm(event);
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
      } else {
        this.subscriptions.push(
          this._store
            .dispatch(new EditPolicy(formValue))
            .pipe(
              mergeMap((x) => {
                return this._store.dispatch(
                  new AllPolicyList(policyListListParam)
                );
              })
            )
            .subscribe({
              next: (apiResult) => {
                this.submitted.set(false);
                this.isDisabled.set(false);
                this._loadingBar.useRef().complete();
                this.onCancelAddPolicyForm(event);
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

  onCancelAddPolicyForm(event: Event) {
    this.initAddEditPolicyForm();
    this.closeSidebar.emit(event);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
