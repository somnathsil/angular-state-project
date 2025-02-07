interface IPolicyListParam {
  first: number;
  rows: number;
  filters: {
    policy_name: {
      matchMode: string;
      value: string;
    };
    updated_at: {
      matchMode: string;
      value: string;
    };
    status: {
      matchMode: string;
      value: number | string;
    };
  };
  globalFilter: string;
}

interface IPolicyList {
  id: number;
  policy_name: string;
  status: number;
  order_position: number;
  createdAt: string;
  updatedAt: string;
}

interface IDeletePolicyParam {
  id: number;
}

interface IAddPolicyParam {
  policy_name: string;
  status: number;
}
interface IEditPolicyParam {
  id: number;
  policy_name: string;
  status: number;
}
