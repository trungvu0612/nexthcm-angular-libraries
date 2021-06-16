export interface EmployeeData {
  id: string;
  code: string;
  profile?: Profile;
  contact: Contact;
  registration: number;
  address: Address;
  state: number;
  roles: Role[];
  title: Title;
}

export interface Title {
  id?: string;
  name?: string;
}

export interface Role {
  id?: string;
  name?: string;
}

export interface Contact {
  email: string;
  phone: number;
  id: string;
  contactType: string;
}

export interface Address {
  address1: string;
  address2: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  salary: string;
  userId: string;
}

export interface SearchEmployee {
  name: string;
}
