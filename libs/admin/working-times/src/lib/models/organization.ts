export interface Organization {
	createdDate: number;
	lastModifiedDate: number;
	optCounter: number;
	id: string;
	state: number;
	member: OrgsMember;
	orgType: string;
	orgName: string;
	code: string;
	tenant: OrgsTenant;
}
export interface OrgsMember {
	id: string;
	type: string;
	state: number;
}
export interface OrgsTenant {
	createdDate: number;
	lastModifiedDate: number;
	optCounter: number;
	id: string;
	tenantCode: string;
	tenantName: string;
	state: number;
}
