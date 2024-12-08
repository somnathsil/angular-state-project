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

export class FetchDepartmentList {
  static readonly type = '[FetchDepartmentList] Post';
  constructor(public param: IDepartmentListParam) {}
}
export class DeleteDepartment {
  static readonly type = '[DeleteDepartment] Post';
  constructor(public param: IDeleteDepartmentParam) {}
}
export class AddDepartment {
  static readonly type = '[AddDepartment] Post';
  constructor(public param: IAddDepartmentParam) {}
}
export class EditDepartment {
  static readonly type = '[EditDepartment] Post';
  constructor(public param: IEditDepartmentParam) {}
}
