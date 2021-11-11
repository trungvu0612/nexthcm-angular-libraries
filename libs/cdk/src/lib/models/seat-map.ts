import { CommonStatus, UserState } from '../enums';
import { Office } from './office';
import { UserDto } from './user-dto';

export interface Dimension {
  width: number;
  height: number;
  rounded: number;
}

export interface StyleSeat extends Dimension {
  positionX: number;
  positionY: number;
}

export interface Seat extends StyleSeat {
  id: string;
  label: string;
  assignedUser?: UserDto;
  style: string | StyleSeat;
  seatStatus: 0 | 1;
  statusCheckInOutOfUser: {
    statusOfUser: UserState[];
    inTime?: number;
    outTime?: number;
  };
}

export interface SeatMap {
  id: string;
  name: string;
  status: CommonStatus;
  type: string;
  office?: Office;
  imageUrl: string;
  dimensionX: number;
  dimensionY: number;
  seats: Seat[];
  countCheckedIn: number;
  countCheckedInLate: number;
  countCheckoutEarly: number;
  countCheckedOut: number;
  countLeave: number;
  countWorkingOutsite: number;
  countWfh: number;
  countNotCheckIn: number;
  totalAssignedUser: number;
  totalNotAssigned: number;
}
