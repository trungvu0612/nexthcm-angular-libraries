export interface MenuItem {
  title: string;
  route: string;
  icon?: string;
  permissions: string | string[];
  children?: MenuItem[];
}
