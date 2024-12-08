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
      value: number | string;
    };
    status: {
      matchMode: string;
      value: number | string;
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

/* --------------------------------------------------------------------------------------------------------------*/

interface IDepartmentListParam {
  first: number;
  rows: number;
  filters: {
    name: {
      matchMode: string;
      value: string;
    };
    number_of_employees: {
      matchMode: string;
      value: number | string;
    };
    status: {
      matchMode: string;
      value: number | string;
    };
  };
  globalFilter: string;
}
interface IDepartmentList {
  id: number;
  name: string;
  status: number;
  numberOfEmployees: number;
}
interface IDeleteDepartmentParam {
  id: number;
}
interface IAddDepartmentParam {
  name: string;
  status: number;
  number_of_employees: number;
}
interface IEditDepartmentParam {
  id: number;
  name: string;
  status: number;
  number_of_employees: number;
}
