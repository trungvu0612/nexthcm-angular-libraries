export interface BaseObject {
  id: string;
  name: string;
  isDisable?: boolean;
}

export interface BaseUser extends BaseObject {
  username: string;
  fullName: string;
  avatar?: string;
}
