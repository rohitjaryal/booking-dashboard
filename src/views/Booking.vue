<script setup lang="ts">
import dayjs, { Dayjs } from "dayjs";
import { computed, ref, watch } from "vue";
import { getStationData } from "../apis/booking.api.ts";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  FlagIcon,
} from "@heroicons/vue/24/solid";
import Autocomplete from "../components/Autocomplete.vue";
import useBookingStore from "../stores/booking.store.ts";
import { useRouter } from "vue-router";
import {
  Station,
  WeekViewBooking,
  WeekViewData,
} from "../types/booking.types.ts";
import dateUtils from "../includes/date-utils.ts";

const TOTAL_DAYS_IN_WEEK = 7;
const DATE_FORMAT_SIMPLE = "YYYY-MM-DD";

const bookingStore = useBookingStore();

const router = useRouter();
const defaultDate =
  router.currentRoute.value.query?.defaultDate ??
  dayjs().format(DATE_FORMAT_SIMPLE);

const defaultBeginningOfWeek = dateUtils.getBeginningOfWeek(
  dayjs(defaultDate.toString(), DATE_FORMAT_SIMPLE),
);

const beginningOfWeek = ref<Dayjs>(
  bookingStore.startDateOfWeek || defaultBeginningOfWeek,
);

watch(beginningOfWeek, () => {
  bookingStore.startDateOfWeek = beginningOfWeek.value;
});

const dates = computed<WeekViewData[]>(() => {
  if (!bookingStore.selectedStationData) {
    return [];
  }

  return Array.from({ length: TOTAL_DAYS_IN_WEEK }, (_, i) => {
    const selectedWeekFirstDate = beginningOfWeek.value;
    const newDate = selectedWeekFirstDate.add(i, "day");
    const targetedStationBookings =
      bookingStore.selectedStationData?.bookings ?? [];

    const bookings = targetedStationBookings.reduce<WeekViewBooking[]>(
      (acc, current) => {
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
      },
      [],
    );

    return {
      date: newDate,
      dayNameShort: newDate.format("ddd"),
      dayNumber: newDate.format("DD"),
      dateFormatted: newDate.format(DATE_FORMAT_SIMPLE),
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
  beginningOfWeek.value = dateUtils.getBeginningOfWeek(dayjs());
}

const searchQuery = ref(bookingStore.selectedStationData?.name || "");
const results = ref<Station[]>([]);

const handleInput = async (query: string) => {
  if (query.length > 2) {
    results.value = await getStationData({ query });
  } else {
    results.value = [];
  }
};

const handleModelUpdate = (selection: Station) => {
  bookingStore.selectedStationData = selection;
};

const draggedItem = ref<WeekViewBooking>();

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const handleDrop = (date: string) => {
  if (!date || !draggedItem.value || !bookingStore.selectedStationData) {
    return;
  }

  // debugger;
  const isPickupDate = draggedItem.value.isBookingStartDate;
  const stationData = { ...bookingStore.selectedStationData };
  const targetIndex = stationData.bookings.findIndex((info) =>
    isPickupDate
      ? draggedItem.value?.startDate === info.startDate
      : draggedItem.value?.endDate === info.endDate &&
        info.customerName === draggedItem.value.customerName,
  );

  const targetedBooking = stationData.bookings[targetIndex];

  if (isPickupDate) {
    targetedBooking.startDate = date;
  } else {
    targetedBooking.endDate = date;
  }

  bookingStore.selectedStationData = stationData;
  console.log(
    `The ${isPickupDate ? "Pickup" : "Return"} date has been updated for customer ${targetedBooking.customerName} !!!`,
  );
};

const handleDragStart = (info: WeekViewBooking) => {
  draggedItem.value = info;
};

const currentTouchTarget = ref<EventTarget>();

function handleTouchStart(event: TouchEvent, info: WeekViewBooking) {
  draggedItem.value = info;
  currentTouchTarget.value = event.targetTouches[0].target;
}

function handleTouchMove(event: TouchEvent) {
  event.preventDefault();
}

function handleTouchEnd(event: TouchEvent) {
  const finalTouchTarget = document.elementFromPoint(
    event.changedTouches[0].clientX,
    event.changedTouches[0].clientY,
  );

  if (finalTouchTarget && currentTouchTarget.value !== finalTouchTarget) {
    const dataInfo = finalTouchTarget.getAttribute("data-info");
    if (dataInfo) {
      handleDrop(dataInfo);
    }
  }
}
</script>

<template>
  <div class="p-4 mx-auto w-full">
    <div>
      <autocomplete
        v-model="searchQuery"
        :suggestions="results"
        @input="handleInput"
        @update:modelValue="handleModelUpdate"
      />
    </div>
    <div
      v-if="!bookingStore.selectedStationData"
      class="text-2xl justify-center text-center p-2 m-2 items-center border-b-2 border-b-gray-400"
    >
      Please enter the station to view bookings
    </div>
    <div
      class="flex gap-1 mb-2 mt-4 justify-center items-center pb-2 border-b-2 border-b-gray-400"
      v-if="bookingStore.selectedStationData"
    >
      <div class="mr-2 text-2xl">{{ monthInView }}</div>
      <ChevronDoubleLeftIcon
        class="size-8 text-white cursor-pointer hover:bg-gray-700 bg-gray-500 p-1 rounded"
        @click="handlePreviousWeek"
      />
      <button
        @click="handleCurrentWeekSelection"
        class="cursor-pointer hover:bg-gray-700 text-white bg-gray-500 rounded pt-1 pb-1 pr-2 pl-2"
      >
        Today
      </button>
      <ChevronDoubleRightIcon
        class="size-8 hover:bg-gray-700 cursor-pointer text-white bg-gray-500 rounded p-1"
        @click="handleNextWeek"
      />
    </div>

    <div class="p-1 grid gap-4 grid-cols-1 md:grid-cols-7 md:gap-3">
      <div
        v-for="date in dates"
        :key="date.dateFormatted"
        class="border border-gray-400 min-h-[100px]"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop(date.date.toISOString())"
        @touchend="handleTouchEnd($event)"
        :data-info="date.date.toISOString()"
      >
        <div
          class="w-full flex justify-center p-1 border-b border-b-gray-400 bg-gray-100 font-bold touch-none"
          :class="{
            'text-red-500': date.date.isSame(dayjs(), 'day'),
          }"
        >
          {{ date.dayNameShort }} {{ date.dayNumber }}
        </div>
        <div :key="booking.id" v-for="booking in date.bookings">
          <router-link
            custom
            :to="{
              name: 'detail',
              params: {
                bookingId: booking.id,
                stationId: bookingStore.selectedStationData?.id,
              },
              query: {
                stationName: bookingStore.selectedStationData?.name,
              },
            }"
            v-slot="{ navigate }"
          >
            <div
              class="flex justify-between items-center m-2 p-2 rounded cursor-grab bg-amber-200 hover:bg-amber-400 border border-gray-500"
              @click="navigate"
              draggable="true"
              @dragstart="handleDragStart(booking)"
              @touchstart="handleTouchStart($event, booking)"
              @touchmove="handleTouchMove"
            >
              <FlagIcon
                class="size-4"
                :class="[
                  booking?.isBookingStartDate
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
