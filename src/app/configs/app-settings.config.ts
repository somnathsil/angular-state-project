export const appSettings = {
  appTitle: 'Angular State Project',
  credentialsKey: 'state_project_user',
  rememberKey: 'state_project_remember',
  refreshTokenKey: 'state_project_refresh_token',
  otpCredential: 'state_project-otp-info',
  ajaxTimeout: 300000,
  rowsPerPage: 5,
  accentedCharacters: 'áéíóúüâêôãõàèìòùçÀÁÂÃÉÊÍÓÔÕÚÜÇ',
  whitespacePattern: /^\S+?(?: \S+)*\s?$/,
  userManagementRollId: 1,
  emailPattern:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\\d{1,3}\.\d{1,3}\.\d\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  stringFilterDropDown: [
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'contain', label: 'Contain' },
    { value: 'notContain', label: 'Not Contain' },
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
  ],
  dateFilterDropDown: [
    { value: 'between', label: 'Date is between' },
    // { value: 'dateIsNot', label: 'Date is not' },
    { value: 'before', label: 'Date is before' },
    { value: 'after', label: 'Date is after' },
  ],
  numberFilterDropDown: [
    { value: 'eq', label: 'Equals' },
    { value: 'notEq', label: 'Not Equals' },
  ],
};
