import { DateRange } from '@nexthcm/cdk';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';

export type EmployeeInformationType = 'individual' | 'duration' | 'education' | 'shui';

export interface Token {
  email?: string;
  phone?: string;
  authorities?: string;
  userId?: string;
  orgId?: string;
  tenantId?: string;
  orgType?: string;
  id?: string;
}

export interface BaseOption {
  id: string;
  name: string;
  token: Token;
}

export interface Organization extends BaseOption {
  tenantId?: string;
  orgType?: string;
}

export interface EmployeeGeneralInformation {
  id: string;
  name?: string;
  token: Token;
  cif: string;
  userName: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  image: string;
  status: number;
  profileType: string;
  registerType: string;
  registration: number;
  organization: Organization;
  roles: BaseOption[];
  jobTitle: BaseOption;
  jobLevel?: BaseOption;
  directReport: BaseOption;
}

export interface BankAccount {
  bank: string;
  number: number;
}

export interface EmployeeIndividual {
  employeeId: string;
  type: EmployeeInformationType;
  permanentAddress: string;
  temporaryAddress: string;
  birthDate: string | TuiDay | Date;
  idNumber: number;
  issueOn: string | TuiDay | Date;
  issueAt: string;
  currentStatus: number;
  companyEmail: string;
  personalEmail: string;
  phoneNumber: number;
  bankAccounts: BankAccount[] | string;
  office: BaseOption | string;
  officeOnsite?: string;
}

export interface EmergencyContact {
  phoneNumber: string;
  relationship: string;
}

export interface EmployeeDuration {
  type?: string;
  emergencyContacts?: EmergencyContact[] | string;
  employeeId?: string;
  onboardDate?: string | TuiDay | Date;
  probationDate?: DateRange | TuiDayRange | string;
  officialStartDate?: string | TuiDay | Date;
  terminationDate?: string | TuiDay | Date;
  probationNumber?: number;
  labourContractNumber?: string;
  labourContractDate?: string | TuiDay | Date;
  indefiniteTermContract?: string;
  indefiniteTermContractDate?: string | TuiDay | Date;
  resignationAgreement?: string;
  resignationAgreementDate?: string | TuiDay | Date;
}

export interface EmployeeEducation {
  employeeId: string;
  type?: string;
  university?: string;
  major?: string;
  highestCertificate?: string;
  graduationYear?: string;
  description?: string;
}

export interface HealthCare {
  healthcare: string;
  number: string;
}

export interface EmployeeSHUI {
  employeeId: string;
  type: EmployeeInformationType;
  taxIDNumber: string;
  socialInsuranceNumber: string;
  socialInsurancePlace: string;
  familyHealthyCareNumber: string;
  familyAllowance: string;
  healthInsuranceNumber: string;
  healthCares: HealthCare[] | string;
}
