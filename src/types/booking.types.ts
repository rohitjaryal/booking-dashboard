import { Dayjs } from "dayjs";

export interface Booking {
  id: string;
  pickupReturnStationId: string;
  customerName: string;
  startDate: string;
  endDate: string;
}

export interface Station {
  id: string;
  name: string;
  bookings: Booking[];
}

export interface WeekViewBooking extends Booking {
  isBookingStartDate?: boolean;
}

export interface WeekViewData {
  date: Dayjs;
  dayNameShort: string;
  dayNumber: string;
  dateFormatted: string;
  bookings: WeekViewBooking[];
}
