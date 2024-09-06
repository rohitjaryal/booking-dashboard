import { defineStore } from "pinia";
import { Dayjs } from "dayjs";
import { Station } from "../types/booking.types.ts";

export default defineStore("bookingsView", {
  state: () => ({
    selectedStationData: null as Station | null,
    startDateOfWeek: null as Dayjs | null,
  }),
});
