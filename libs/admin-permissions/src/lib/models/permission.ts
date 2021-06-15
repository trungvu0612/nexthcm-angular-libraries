export interface ServiceInfo {
  id: string;
  name: string;
  description: string;
}

export interface Action {
  list: string[];
  read: string[];
  write: string[];
}

export interface Service {
  service: ServiceInfo;
  actions: Action;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  services: Service[];
}
