interface UserGroup {
  groupName: string;
}

interface Contact {
  email: string;
  phone: string;
  skype: string;
  facebook: string;
  instagram: string;
}

interface Profile {
  image: string;
  birthDay: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface User {
  id: string;
  username: string;
  code: string;
  state: number;
  profile: Profile;
  contact: Contact;
  userGroups: UserGroup[];
}
