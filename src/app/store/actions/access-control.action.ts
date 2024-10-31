export class FetchRoleList {
  static readonly type = '[FetchRoleList] Post';
  constructor(public param: IRoleListParam) {}
}
export class DeleteRole {
  static readonly type = '[DeleteRole] Post';
  constructor(public param: IDeleteRoleParam) {}
}
export class AddRole {
  static readonly type = '[AddRole] Post';
  constructor(public param: IAddRoleParam) {}
}
export class EditRole {
  static readonly type = '[EditRole] Post';
  constructor(public param: IEditRoleParam) {}
}
