export interface BaseItem {
  id: string;
  name: string;
}

export interface CalendarBuilding extends BaseItem {
  image: string;
  address: string;
}

export interface InvitePerson extends BaseItem {
  image: string;
  position: string;
}

export type ExternalEmail = BaseItem
