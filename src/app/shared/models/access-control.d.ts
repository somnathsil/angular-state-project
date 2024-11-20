interface IRoleListParam {
  first: number;
  rows: number;
  filters: {
    name: {
      matchMode: string;
      value: string;
    };
    number_of_employees: {
      matchMode: string;
      value: number;
    };
    status: {
      matchMode: string;
      value: number;
    };
  };
  globalFilter: string;
}
interface IRoleList {
  id: number;
  name: string;
  status: number; // 1 => Active; 0 -> Inactive
  numberOfEmployees: number;
}
interface IDeleteRoleParam {
  id: number;
}
interface IAddRoleParam {
  name: string;
  status: number; // 1 => Active; 0 -> Inactive
  number_of_employees: number;
}
interface IEditRoleParam {
  id: number;
  name: string;
  status: number; // 1 => Active; 0 -> Inactive
  number_of_employees: number;
}
