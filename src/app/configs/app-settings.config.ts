export const appSettings = {
  appTitle: 'Angular State Project',
  credentialsKey: 'state_project_user',
  rememberKey: 'state_project_remember',
  refreshTokenKey: 'state_project_refresh_token',
  otpCredential: 'state_project-otp-info',
  ajaxTimeout: 300000,
  rowsPerPage: 3,
  accentedCharacters: 'áéíóúüâêôãõàèìòùçÀÁÂÃÉÊÍÓÔÕÚÜÇ',
  whitespacePattern: /^\S+?(?: \S+)*\s?$/,
  userManagementRollId: 1,
  emailPattern:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\\d{1,3}\.\d{1,3}\.\d\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  stringFilterDropDown: [
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'contains', label: 'Contains' },
    { value: 'notContains', label: 'Not Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
  ],
  dateFilterDropDown: [
    { value: 'dateIs', label: 'Date is' },
    { value: 'dateIsNot', label: 'Date is not' },
    { value: 'dateIsBefore', label: 'Date is before' },
    { value: 'dateIsAfter', label: 'Date is after' },
  ],
  numberFilterDropDown: [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
  ],
};
