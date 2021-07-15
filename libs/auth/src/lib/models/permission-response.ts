interface Roles {
  [k: string]: string[];
}

export interface PermissionsResponse {
  permissions: string[];
  roles: Roles;
}
