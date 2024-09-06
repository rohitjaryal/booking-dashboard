export interface BookingDetails {
  id: string;
  pickupReturnStationId: string;
  customerName: string;
  startDate: string;
  endDate: string;
}

export interface BookingDetailsWithExtraInfo extends BookingDetails {
  duration: number;
  relativeDuration: string;
}
