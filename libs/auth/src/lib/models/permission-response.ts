export interface PermissionResponse {
  service: string;
  permissions: string[];
}

export interface AppPermissions {
  [k: string]: string[];
}
