interface IChangePasswordParam {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface IProfileData {
  name: string;
  email: string;
  phone_number: string | number;
  profile_image: string;
}

interface IEditProfileData {
  name: string;
  phone_number: string;
  profile_image: string;
}
