export interface ModulePermissions {
  [module: string]: {
    [action: string]: string | string[];
  };
}
