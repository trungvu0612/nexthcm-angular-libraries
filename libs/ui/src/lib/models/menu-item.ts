import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';

export interface MenuItem {
  label: string;
  link: string;
  icon?: string;
  permissions: string | string[];
  children?: MenuItem[];
  // @bad TODO remove
  submenu?: PolymorpheusContent;
}
