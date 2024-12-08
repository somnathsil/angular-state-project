export class FetchUserManagementList {
  static readonly type = '[FetchUserManagementList] Post';
  constructor(public param: IUserManagementListParam) {}
}
