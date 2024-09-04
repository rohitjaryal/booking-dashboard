import { defineStore } from "pinia";
import { Dayjs } from "dayjs";
// import { HeadlineRequest, NewsDataStoreInterface } from '../types/list.types.ts';

export default defineStore("bookingsView", {
  state: () => ({
    selectedStationData: null,
    startDateOfWeek: Dayjs,
  }),
});
