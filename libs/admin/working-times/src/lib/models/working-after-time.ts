export interface WorkingAfterTime {
	id: string;
	checkInAfter: number;
	checkOutBefore: number;
	workingHour: number;
	totalWorkingHour: number;
	lunchHours: number;
	fingerPrint: boolean;
	timePayroll: boolean;
	timePaidLeave: boolean;
	minOtHours: number;
	maxOtHours: number;
	minOtMinutes: number;
	maxOtMinutes: number;
	otBreakHours: number;
	minStart: number;
	startLunch: number;
	endLunch: number;
	items: WorkingAfterTimeItems[];
}
export interface WorkingAfterTimeItems {
	id: string;
	values: any[];
	totalTime: number;
	weekDayId: number;
	configType: number;
}
