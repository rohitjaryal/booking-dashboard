<script setup lang="ts">
import dayjs from "dayjs";
import { computed, ref } from "vue";
import { getBookingData } from "../apis/booking.api.ts";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  FlagIcon,
} from "@heroicons/vue/24/solid";

const TOTAL_DAYS_IN_WEEK = 7;

const currentWeek = dayjs(dayjs()).startOf("week").add(1, "day");
const beginningOfWeek = ref(currentWeek);

const bookingsData = getBookingData();

const dates = computed(() => {
  return Array.from({ length: TOTAL_DAYS_IN_WEEK }, (_, i) => {
    const selectedWeekFirstDate = beginningOfWeek.value;
    const newDate = dayjs(selectedWeekFirstDate).add(i, "day");
    const targetedStationBookings = bookingsData[0].bookings;

    const bookings = targetedStationBookings.reduce((acc, current) => {
      const isBookingStartDate = newDate.isSame(
        dayjs(current.startDate),
        "day",
      );
      const isBookingEndDate = newDate.isSame(dayjs(current.endDate), "day");
      if (isBookingStartDate || isBookingEndDate) {
        return [
          ...acc,
          {
            ...current,
            isBookingStartDate,
          },
        ];
      }
      return acc;
    }, []);

    return {
      date: newDate,
      dayNameShort: newDate.format("ddd"),
      dayNumber: newDate.format("DD"),
      dateFormatted: newDate.format("YYYY-MM-DD"),
      bookings,
    };
  });
});

const monthInView = computed(() => {
  return `${beginningOfWeek.value.format("MMMM")} ${beginningOfWeek.value.format("YYYY")}`;
});

function handlePreviousWeek() {
  beginningOfWeek.value = dayjs(beginningOfWeek.value).add(-1, "week");
}

function handleNextWeek() {
  beginningOfWeek.value = dayjs(beginningOfWeek.value).add(1, "week");
}

function handleCurrentWeekSelection() {
  beginningOfWeek.value = currentWeek;
}

const selectedStation = ref("1");
</script>

<template>
  <div class="bg-amber-100 p-4 mx-auto w-full">
    <div>
      <select v-model="selectedStation" class="p-2 border rounded">
        <option value="1">Berlin</option>
        <option value="2">Other city</option>
      </select>
    </div>
    <div class="text-red-900 bg-amber-400">{{ monthInView }}</div>
    <div class="flex justify-end gap-1 m-2">
      <ChevronDoubleLeftIcon
        class="size-10 text-white hover:bg-amber-400 bg-gray-500 p-1 rounded"
        @click="handlePreviousWeek"
      />
      <button
        @click="handleCurrentWeekSelection"
        class="hover:bg-amber-400 cursor-pointer text-white bg-gray-500 rounded pt-1 pb-1 pr-2 pl-2"
      >
        Today
      </button>
      <ChevronDoubleRightIcon
        class="size-10 hover:bg-amber-400 text-white bg-gray-500 rounded p-1"
        @click="handleNextWeek"
      />
    </div>

    <div
      class="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-500 mb-2 mt-2"
    >
      <span
        v-for="day in dates"
        :key="day.dateFormatted"
        class="border border-red-500"
        :class="[
          'p-2 rounded text-center',
          day.date.isSame(dayjs(), 'day')
            ? 'bg-red-500 text-white'
            : 'bg-gray-100',
        ]"
        >{{ day.dayNameShort }} {{ day.dayNumber }}</span
      >
    </div>
    <div class="grid grid-cols-7 gap-3">
      <div
        v-for="date in dates"
        :key="date.dateFormatted"
        class="border border-gray-500"
      >
        <div :key="booking.id" v-for="booking in date.bookings">
          <router-link
            custom
            :to="{
              name: 'detail',
              params: { bookingId: booking.id, stationId: selectedStation },
            }"
            v-slot="{ navigate }"
          >
            <div
              class="flex justify-between items-center border border-red-500 m-2 p-2 rounded cursor-pointer hover:bg-amber-400"
              @click="navigate"
            >
              <FlagIcon
                class="size-4"
                :class="[
                  booking.isBookingStartDate
                    ? 'text-green-500'
                    : 'text-red-500',
                ]"
              />
              <span>{{ booking.customerName }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
