interface IAuthParam {
  email: string;
  password: string;
}
interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

// interface IAuthResponse {
//   departments: IInitialDepartmentList[];
//   name: string;
//   email: string;
//   access_token: string;
//   user_type?: string; // added by front-end
//   token_type: string;
//   profile_image: string;
//   refresh_token: string;
//   is_enrolled: number;
//   is_primary: number;
// }

interface IRegistrationParam {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface IRegistrationResponse {
  id: number;
  name: string;
  email: string;
  updatedAt: string;
  createdAt: string;
}
interface IForgetPasswordParam {
  email: string;
}
interface IForgetPasswordResponse {
  otp: string;
}
interface IOtpParam {
  email: string;
  otp: string;
}
interface IResendOtpParam {
  email: string;
}
interface IResetPWDParam {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

interface ICreatePWDParam {
  email: string;
  new_pwd: string;
  conf_pwd: string;
  user_type: string;
  identifier: string;
}

interface IQueryParamData {
  email: string;
  identifier: string;
}

interface IRegenerateTokenParam {
  // browser_id: string;
  // browser_name: string;
  refresh_token: string;
  // browser_version: string;
}

interface IUnsubscribeParam {
  identifier: string;
  subscription_status: number;
  email: string;
}

interface ICreatePasswordParam {
  enc_id: string;
  password: string;
  confirm_password: string;
}

interface ISocialLoginData {
  username: string;
  social_id: string;
  social_access_token: string;
  social_type: 1 | 2; // 1 => Google; 2 => Outlook;
  encrypted_code: string;
}

interface ISocialAuthParam {
  username: string;
  social_id: string;
  social_access_token: string;
  social_type: 1 | 2; // 1 => Google; 2 => Outlook;
  encrypted_code: string;
  // browser_id: string;
  // browser_version: string;
  // session_id: string;
  // browser_name: string;
}
