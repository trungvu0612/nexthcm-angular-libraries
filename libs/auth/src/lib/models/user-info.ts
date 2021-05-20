export interface Module {
  roles: string[];
}

export interface ResourceAccess {
  [key: string]: Module;
}

export interface UserInfo {
  exp?: number;
  iat?: number;
  jti?: string;
  iss?: string;
  aud?: string[];
  sub?: string;
  typ?: string;
  azp?: string;
  session_state?: string;
  acr?: string;
  'allowed-origins'?: string[];
  realm_access?: Module;
  resource_access?: ResourceAccess;
  scope?: string;
  email_verified?: boolean;
  givenName?: string;
  name?: string;
  preferred_username?: string;
  id: string;
  family_name?: string;
  email?: string;
  tenantId?: string;
  orgId?: string;
  userId?: string;
  orgType: string;
}
