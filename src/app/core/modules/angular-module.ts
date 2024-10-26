import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* Material Module Imports */
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';

export const angularModule = [CommonModule, RouterModule];
export const angularFormsModule = [
  FormsModule,
  ReactiveFormsModule,
  MatSelectModule,
];
export const angularTableModule = [
  MatTableModule,
  MatPaginatorModule,
  MatMenuModule,
  MatFormFieldModule,
];
export const angularDatepickerModule = [
  MatDatepickerModule,
  MatNativeDateModule,
];

export const angularDragAndDrop = [CdkDropList, CdkDrag];

export const angularSidenavModule = [MatSidenavModule];
