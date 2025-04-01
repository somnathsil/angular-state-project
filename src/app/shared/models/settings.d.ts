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

interface IServiceTypeListParam {
  first: number;
  rows: number;
  filters: {
    service_type_name: {
      matchMode: string;
      value: string;
    };
    service_month: {
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

interface IServiceTypeList {
  id: number;
  service_type_name: string;
  service_month: string | number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

interface IDeleteServiceTypParam {
  id: number;
}

interface IMasterMonthList {
  id: number;
  month_name: string;
}

interface IAddServiceTypeParam {
  service_type_name: string;
  status: number;
  service_month: string | number;
}

interface IEditServiceTypeParam {
  id: number;
  service_type_name: string;
  status: number;
  service_month: string | number;
}
