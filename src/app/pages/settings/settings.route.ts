import { Routes } from '@angular/router';
import { ChangePasswordComponent, EditProfileComponent } from './components';

export const settingtRoutes: Routes = [
  {
    path: 'change-password',
    title: 'Change Password',
    component: ChangePasswordComponent,
  },
  {
    path: 'edit-profile',
    title: 'Edit Profile',
    component: EditProfileComponent,
  },
];
