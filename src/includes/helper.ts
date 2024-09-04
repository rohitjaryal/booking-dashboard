import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export default {
  convertTimeStampToTimeAgo(time: string) {
    return time ? dayjs(dayjs(time)).fromNow() : "";
  },
  parseDateTimeInReadableFormat(date: Dayjs) {
    return dayjs(date).format("MMMM D, YYYY h:mm A");
  },
  getDifferenceInDates(startDateTime, endDateTime, unit = "day"): number {
    const startDate = dayjs(startDateTime);
    const endDate = dayjs(endDateTime);
    return endDate.diff(startDate, unit);
  },
  getRelativeDuration(difference: number) {
    return dayjs
      .duration(difference, "days")
      .format("Y [year], M [month], D [days]");
  },
};
