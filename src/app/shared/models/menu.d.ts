interface IMenu {
  id: string;
  URl: string;
  label: string;
  icon?: string;
  isActive: boolean;
  subMenus: IMenu[];
  isSubMenuOpen: boolean;
}
