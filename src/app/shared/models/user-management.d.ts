interface IUserManagementListParam {
  first: number;
  rows: number;
  filters: {
    name: {
      matchMode: string;
      value: string;
    };
    email: {
      matchMode: string;
      value: string;
    };
  };
  globalFilter: string;
}

interface IUserManagementList {
  id: number;
  name: string;
  email: string;
}
