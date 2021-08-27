export interface JobTitle {
  id: string;
  name?: string;
  description?: string;
  hasLevel?: boolean;
  stateCov?: boolean;
  state: number | boolean;
  createdBy?: string;
  createdDate?: string;
  lastModifiedDate?: number;
  infoUserCreated?: InfoUserCreated;
}

export interface InfoUserCreated {
  id: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  fullName?: string;
}

