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

export class AllServiceTypeList {
  static readonly type = '[AllServiceTypeList] post';
  constructor(public param: IServiceTypeListParam) {}
}

export class DeleteServiceType {
  static readonly type = '[DeleteServiceType] Post';
  constructor(public param: IDeleteServiceTypParam) {}
}

export class AddServiceType {
  static readonly type = '[AddServiceType] Post';
  constructor(public param: IAddServiceTypeParam) {}
}
export class EditServiceType {
  static readonly type = '[EditServiceType] Post';
  constructor(public param: IEditServiceTypeParam) {}
}
export class FetchMothList {
  static readonly type = '[FetchMothList] Get';
  constructor() {}
}
