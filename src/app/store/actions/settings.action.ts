export class AllPolicyList {
  static readonly type = '[AllPolicyList] post';
  constructor(public param: IPolicyListParam) {}
}

export class DeletePolicy {
  static readonly type = '[DeletePolicy] Post';
  constructor(public param: IDeletePolicyParam) {}
}

export class AddPolicy {
  static readonly type = '[AddPolicy] Post';
  constructor(public param: IAddPolicyParam) {}
}
export class EditPolicy {
  static readonly type = '[EditPolicy] Post';
  constructor(public param: IEditPolicyParam) {}
}
