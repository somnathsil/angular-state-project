import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { angularModule } from '@app/core/modules';

@Component({
  selector: 'warning-dialog',
  standalone: true,
  imports: [angularModule],
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss'],
})
export class WarningDialogComponent implements OnInit {
  dialogType: 'normal' | 'warning' = 'warning';
  photoIcon = '';
  title: string = 'Warning';
  message: string = '';
  confirmButtonText = 'Save';
  cancelButtonText = 'No';
  @Output('onConfirmDialog') onConfirmDialog: EventEmitter<boolean> =
    new EventEmitter();
  @Output('onCancelDialog') onCancelDialog: EventEmitter<boolean> =
    new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<WarningDialogComponent>
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.dialogType = this.data.dialogType || this.dialogType;
      this.photoIcon = this.data.photoIcon || this.photoIcon;
      this.title = this.data.title || this.title;
      this.message = this.data.message || this.message;
      if (this.data.buttonText) {
        this.confirmButtonText =
          this.data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText =
          this.data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  /*
   * *Mat Dialog Delete Method
   */
  onConfirmDialogFn(event: Event) {
    this.onConfirmDialog.emit(true);
    this.dialogRef.close(true);
  }

  /*
   * *Mat Dialog Close Method
   */
  onCancelDialogFn(): void {
    this.onCancelDialog.emit(true);
    this.dialogRef.close(true);
  }
}
