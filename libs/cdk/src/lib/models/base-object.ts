export interface BaseObject {
  id: string;
  name: string;
}

export interface BaseUser extends BaseObject {
  username: string;
}
