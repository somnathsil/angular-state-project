import { Routes } from '@angular/router';
import {
  EnterOtpComponent,
  ForgotPasswordComponent,
  LoginComponent,
  RegistrationComponent,
  ResetPasswordComponent,
} from './components';

export const authRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '',
    title: 'Login',
    component: LoginComponent,
  },
  {
    path: 'registration',
    title: 'Registration',
    component: RegistrationComponent,
  },
  {
    path: 'forgot-password',
    title: 'Forget Password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'enter-otp',
    title: 'Enter OTP',
    component: EnterOtpComponent,
  },
  {
    path: 'reset-password',
    title: 'Reset Password',
    component: ResetPasswordComponent,
  },
];
