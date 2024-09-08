import {
  BookingDetails,
  BookingDetailsWithExtraInfo,
} from "../types/booking-details.types.ts";
import { fetchRequest } from "../includes/axios.ts";
import dateUtils from "../utils/date-utils.ts";
import dayjs from "dayjs";

interface BookingDetailsPayload {
  stationId: string;
  bookingId: string;
}

export const getBookingDetails = async (
  payload: BookingDetailsPayload,
): Promise<BookingDetailsWithExtraInfo> => {
  const response = await fetchRequest.get<BookingDetails>(
    `stations/${payload.stationId}/bookings/${payload.bookingId}`,
  );

  const { data } = response;
  const duration = dateUtils.getDifferenceInDates(data.startDate, data.endDate);
  const relativeDuration = dateUtils.getRelativeDuration(duration);
  return {
    ...data,
    startDate: dateUtils.parseDateTimeInReadableFormat(dayjs(data.startDate)),
    endDate: dateUtils.parseDateTimeInReadableFormat(dayjs(data.endDate)),
    duration,
    relativeDuration,
  };
};
