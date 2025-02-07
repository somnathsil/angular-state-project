import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { appSettings } from '@app/configs';
import { angularModule } from '@app/core/modules';
import { CommonService } from '@app/core/services';
import { fadeAnimation } from '@app/shared/animations';
import { ListFilterComponent } from '@app/shared/components/list-filter/list-filter.component';
import { EditProfile, GetProfileData } from '@app/store/actions/profile.action';
import { ProfiletState } from '@app/store/state/profile.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [angularModule, ListFilterComponent, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  animations: [fadeAnimation],
})
export class EditProfileComponent implements OnInit {
  private _common = inject(CommonService);
  private formBuilder = inject(FormBuilder);
  private _store = inject(Store);
  private _toastr = inject(ToastrService);
  private _loadingbar = inject(LoadingBarService);

  private submitted = signal<boolean>(false);

  public editProfileForm!: FormGroup;
  public profileData!: IProfileData | null;
  public subscriptions: Subscription[] = [];
  public fileData: File | null = null;
  public imageFlag = false;
  public proImage = './assets/images/drip-no-image.png';
  // base64FileOrURL!: string | ArrayBuffer | null | undefined;
  // private finalEditData!: IProfileData;

  public profileData$: Observable<IProfileData | null> = this._store.select(
    ProfiletState.profileData
  );

  constructor() {}

  ngOnInit(): void {
    this.initializeEditProfileForm();
    this.onLoadProfile();
    this.getDataFromStore();
  }

  private getDataFromStore() {
    this.subscriptions.push(
      this.profileData$.subscribe((data) => {
        this.profileData = structuredClone(data);
        this.profileFormPatch();
      })
    );
  }

  private onLoadProfile() {
    this._store.dispatch(new GetProfileData()).subscribe({
      next: () => {
        setTimeout(() => {
          this._loadingbar.useRef().complete();
          this._common.setLoadingStatus(false);
        }, 50);
      },
      error: (apiError) => {
        this._loadingbar.useRef().complete();
        this._common.setLoadingStatus(false);
        this._toastr.error(apiError.error.response.status.message, 'error', {
          closeButton: true,
          timeOut: 3000,
        });
      },
    });
  }

  private profileFormPatch() {
    if (this.profileData) {
      this.editProfileForm.patchValue({
        name: this.profileData.name,
        email: this.profileData.email,
        phone_number: this.profileData.phone_number,
        profile_image: this.profileData.profile_image,
      });
      // this.base64FileOrURL = this.profileData.profile_image;
    }
  }

  private initializeEditProfileForm() {
    this.editProfileForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(appSettings.whitespacePattern),
        Validators.maxLength(200),
      ]),
      phone_number: new FormControl('', [Validators.required]),
      email: new FormControl({ value: '', disabled: true }),
      profile_image: ['', []],
    });
  }

  public hasFormControlError(field: string): boolean {
    const control = this.editProfileForm.get(field) as FormControl;
    if (
      (this.submitted() && control.errors) ||
      (control.invalid && control.dirty)
    ) {
      return true;
    }
    return false;
  }

  get formControl() {
    return this.editProfileForm.controls;
  }

  public editProfileFormSubmit() {
    this.submitted.set(true);

    if (this.editProfileForm.valid) {
      const formValue = this.editProfileForm.getRawValue();
      // this.finalEditData = {
      //   ...formValue,
      //   profile_image: this.base64FileOrURL,
      // };

      const formData = new FormData();
      formData.append('name', this.editProfileForm.get('name')?.value);
      formData.append('email', `${formValue.email}`);
      formData.append(
        'phone_number',
        this.editProfileForm.get('phone_number')?.value
      );
      formData.append(
        'profile_image',
        this.editProfileForm.get('profile_image')?.value
      );
      this._loadingbar.useRef().start();
      this.subscriptions.push(
        this._store.dispatch(new EditProfile(formData)).subscribe({
          next: () => {
            setTimeout(() => {
              this.submitted.set(true);
              this._loadingbar.useRef().complete();
              this.profileData = structuredClone(formValue);
              this.profileFormPatch();
            }, 50);
          },
          error: (apiError) => {
            this.submitted.set(true);
            this._loadingbar.useRef().complete();
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
    }
  }

  /* Using base64 image format */
  // public async onSelectFile(event: Event) {
  //   const file = (event.target as HTMLInputElement).files as FileList;
  //   if (file && file.length) {
  //     const allowedFileTypes = ['jpg', 'jpeg', 'png', 'webp'];

  //     const type = file[0].name.split('.').pop()?.toLowerCase() as string;
  //     if (allowedFileTypes.indexOf(type) !== -1) {
  //       this.fileData = file[0];
  //       //convert in base64 format
  //       const toBase64 = (file: File) =>
  //         new Promise((resolve, reject) => {
  //           const reader = new FileReader();
  //           reader.readAsDataURL(file);
  //           reader.onload = () => resolve(reader.result);
  //           reader.onerror = reject;
  //         });
  //       this.base64FileOrURL = (await toBase64(file[0])) as
  //         | string
  //         | ArrayBuffer
  //         | null;

  //       this.editProfileForm.get('profile_image')?.setValue(file[0]);
  //     } else {
  //       this._toastr.error('Only accept image file', 'error', {
  //         closeButton: true,
  //         timeOut: 3000,
  //       });
  //       this.base64FileOrURL = this.profileData?.profile_image;
  //       this.editProfileForm.get('profile_image')?.reset();
  //     }
  //   }
  // }

  onLocalFileSelect(event: any) {
    const selectedFiles = event.target.files;
    let isInvalidFile = false;
    if (selectedFiles.length > 0) {
      const formData: FormData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        if (selectedFiles[i].size > 1024 * 1024 * 5) {
          isInvalidFile = true;
        } else {
          const mimeType = selectedFiles[i].name.split('.');
          if (
            mimeType[1] === 'png' ||
            mimeType[1] === 'jpg' ||
            mimeType[1] === 'jpeg'
          ) {
            this.editProfileForm
              .get('profile_image')
              ?.setValue(selectedFiles[i]);
          } else {
            isInvalidFile = true;
          }
        }
        //For preview file
        this.imageFlag = true;
        let reader = new FileReader();
        reader.readAsDataURL(selectedFiles[i]);
        reader.onload = (e: any) => {
          this.proImage = e.target.result;
        };
      }
      // if (isInvalidFile) {
      //   console.log('please upload a valid file');
      // } else {
      // }
    } else {
      console.log('please upload a file');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((ele) => ele.unsubscribe());
  }
}
