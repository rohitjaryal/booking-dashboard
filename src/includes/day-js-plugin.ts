import dayjs from "dayjs";
import "dayjs/locale/en";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(updateLocale);
const DAY_MONDAY = 1;
dayjs.updateLocale("en", {
  weekStart: DAY_MONDAY, // Default week start on Sunday.
});
