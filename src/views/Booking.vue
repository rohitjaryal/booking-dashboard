<script setup lang="ts">
import dayjs, { Dayjs } from "dayjs";
import { computed, ref } from "vue";
import { getBookingData } from "../apis/booking.api.ts";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  FlagIcon,
} from "@heroicons/vue/24/solid";
import Autocomplete from "../components/Autocomplete.vue";
import useBookingStore from "../stores/booking.store.ts";
import { useRouter } from "vue-router";

const TOTAL_DAYS_IN_WEEK = 7;

const bookingStore = useBookingStore();

const router = useRouter();
const defaultDate =
  router.currentRoute.value.query?.defaultDate ?? "2021-09-20";

const getBeginningOfWeek = (date: Dayjs) => {
  return dayjs(date).startOf("week").add(1, "day");
};

const defaultBeginningOfWeek = getBeginningOfWeek(
  dayjs(defaultDate, "YYYY-MM-DD"),
);

const beginningOfWeek = ref(
  bookingStore.startDateOfWeek || defaultBeginningOfWeek,
);
bookingStore.startDateOfWeek = beginningOfWeek;

const dates = computed(() => {
  if (!bookingStore.selectedStationData) {
    return [];
  }

  return Array.from({ length: TOTAL_DAYS_IN_WEEK }, (_, i) => {
    const selectedWeekFirstDate = beginningOfWeek.value;
    const newDate = dayjs(selectedWeekFirstDate).add(i, "day");
    const targetedStationBookings = bookingStore.selectedStationData.bookings;

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
  beginningOfWeek.value = getBeginningOfWeek(dayjs());
}

const searchQuery = ref(bookingStore.selectedStationData?.name || "");
const results = ref([]);

const handleInput = async (query) => {
  if (query.length > 2) {
    results.value = await getBookingData(query);
  } else {
    results.value = [];
  }
};

const handleModelUpdate = (selection) => {
  bookingStore.selectedStationData = selection;
};

const draggedItem = ref<string | null>(null);

const handleDragOver = (props) => {
  // console.log("dragged:>", props);
};

const handleDrop = (props) => {
  /***
   checks to add
   - change end date or start date logic ?  -> check isStartDateFlag   Done.
   -
       **/

  // debugger;
  const isPickupDate = draggedItem.value.isBookingStartDate;
  const stationData = { ...bookingStore.selectedStationData };
  const targetIndex = stationData.bookings.findIndex((info) =>
    isPickupDate
      ? draggedItem.value.startDate === info.startDate
      : draggedItem.value.endDate === info.endDate &&
        info.customerName === draggedItem.value.customerName,
  );

  const targetedBooking = stationData.bookings[targetIndex];

  if (isPickupDate) {
    targetedBooking.startDate = props.date.toISOString();
  } else {
    targetedBooking.endDate = props.date.toISOString();
  }

  // replace the end date with the new end date of that cell
  bookingStore.selectedStationData = stationData;
  console.log(
    `The ${isPickupDate ? "Pickup" : "Return"} date has been updated for customer ${targetedBooking.customerName} !!!`,
  );
};

const handleDragStart = (info, date) => {
  draggedItem.value = info;
};
</script>

<template>
  <div class="bg-amber-100 p-4 mx-auto w-full">
    <div>
      <autocomplete
        v-model="searchQuery"
        :suggestions="results"
        @input="handleInput"
        @update:modelValue="handleModelUpdate"
      />
    </div>
    <div class="text-red-900 bg-amber-400">{{ monthInView }}</div>
    <div v-if="!bookingStore.selectedStationData">
      Please select the station to view bookings
    </div>
    <div
      class="flex justify-end gap-1 m-2"
      v-if="bookingStore.selectedStationData"
    >
      <ChevronDoubleLeftIcon
        class="size-10 text-white cursor-pointer hover:bg-amber-400 bg-gray-500 p-1 rounded"
        @click="handlePreviousWeek"
      />
      <button
        @click="handleCurrentWeekSelection"
        class="cursor-pointer hover:bg-amber-400 text-white bg-gray-500 rounded pt-1 pb-1 pr-2 pl-2"
      >
        Today
      </button>
      <ChevronDoubleRightIcon
        class="size-10 hover:bg-amber-400 cursor-pointer text-white bg-gray-500 rounded p-1"
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
        :class="['bg-green-400']"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop(date)"
      >
        <div :key="booking.id" v-for="booking in date.bookings">
          <router-link
            custom
            :to="{
              name: 'detail',
              params: {
                bookingId: booking.id,
                stationId: bookingStore.selectedStationData.id,
              },
              query: {
                stationName: bookingStore.selectedStationData.name,
              },
            }"
            v-slot="{ navigate }"
          >
            <div
              class="flex justify-between items-center border border-red-500 m-2 p-2 rounded cursor-pointer hover:bg-amber-400"
              @click="navigate"
              draggable="true"
              @dragstart="handleDragStart(booking, date)"
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
