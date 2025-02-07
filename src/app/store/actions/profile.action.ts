export class ChangePassword {
  static readonly type = '[ChangePassword] Post';
  constructor(public param: IChangePasswordParam) {}
}

export class GetProfileData {
  static readonly type = '[GetProfileData] Post';
  constructor() {}
}

export class EditProfile {
  static readonly type = '[EditProfile] Post';
  constructor(public param: any) {}
}
