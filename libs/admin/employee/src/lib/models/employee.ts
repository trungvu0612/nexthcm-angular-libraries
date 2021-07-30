import { TuiDay } from '@taiga-ui/cdk';

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

export interface EmployeeDuration {
  [x: string]: any;
}

export interface EmployeeEducation {
  [x: string]: any;
}

export interface EmployeeSHUI {
  [x: string]: any;
}

export interface Employee
  extends EmployeeGeneralInformation,
    EmployeeIndividual,
    EmployeeDuration,
    EmployeeEducation,
    EmployeeSHUI {}

export interface BaseEmployee {
  [x: string]: any;
}
