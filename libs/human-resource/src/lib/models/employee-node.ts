export interface EmployeeNode {
	id: string;
	fullName: string;
	organization: EmployeeNodeOrganization;
	jobTitle: EmployeeNodeJobTitle;
	profile: EmployeeNodeProfile;
	reportTo: EmployeeNodeReportTo;
	descendants: EmployeeNode[];
}

export interface EmployeeNodeOrganization {
	id: string;
	orgName: string;
}

export interface EmployeeNodeJobTitle {
	id: string;
	name: string;
}

export interface EmployeeNodeProfile {
	image: string;
	phone: string;
	personalEmail: string;
	companyEmail: string;
}

export interface EmployeeNodeReportTo {
	id: string;
	fullName: string;
}
