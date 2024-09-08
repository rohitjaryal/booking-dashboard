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
import dateUtils from "../utils/date-utils.ts";

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

const weeklyDates = computed<WeekViewData[]>(() => {
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

const draggedItem = ref<WeekViewBooking | null>();

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const handleDrop = (dropContainerDate: string) => {
  if (
    !dropContainerDate ||
    !draggedItem.value ||
    !bookingStore.selectedStationData
  ) {
    return;
  }

  const isDroppedOnSameDate = draggedItem.value.isBookingStartDate
    ? draggedItem.value.startDate === dropContainerDate
    : draggedItem.value.endDate === dropContainerDate;

  if (isDroppedOnSameDate) {
    console.log("Can't drag and drop booking on same day!");
    return;
  }

  try {
    const isPickupDate = draggedItem.value.isBookingStartDate;
    const stationData = { ...bookingStore.selectedStationData };

    const targetIndex = stationData.bookings.findIndex(
      (info) => info.id === draggedItem.value?.id,
    );

    if (targetIndex === -1) {
      console.error("Not able to find valid booking.");
      return;
    }

    const targetedBooking = stationData.bookings[targetIndex];

    if (isPickupDate) {
      targetedBooking.startDate = dropContainerDate;
    } else {
      targetedBooking.endDate = dropContainerDate;
    }

    bookingStore.selectedStationData = stationData;
    console.log(
      `The ${isPickupDate ? "Pickup" : "Return"} date has been updated for customer ${targetedBooking.customerName} !!!`,
    );
  } catch (error) {
    console.error(error);
  } finally {
    draggedItem.value = null;
  }
};

const handleDragStart = (info: WeekViewBooking) => {
  draggedItem.value = info;
};

const currentTouchTarget = ref<EventTarget>();
const touchCoordinates = ref([0, 0]);

function handleTouchStart(event: TouchEvent, info: WeekViewBooking) {
  draggedItem.value = info;
  currentTouchTarget.value = event.targetTouches[0].target;
  const touch = event.touches[0];
  touchCoordinates.value = [touch.clientX, touch.clientY - 20];
  touchStarted.value = true;
}

const touchStarted = ref(false);
function handleTouchMove(event: TouchEvent) {
  event.preventDefault();
  const touch = event.touches[0];
  touchCoordinates.value = [touch.clientX, touch.clientY - 20];
}

function handleTouchEnd(event: TouchEvent) {
  touchStarted.value = false;

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
  <div class="p-4 mx-auto w-full select-none">
    <div
      v-if="!bookingStore.selectedStationData"
      class="text-2xl justify-center text-center p-2 m-2 items-center"
    >
      Please enter the station to view bookings
    </div>
    <div>
      <autocomplete
        v-model="searchQuery"
        :suggestions="results"
        @input="handleInput"
        @update:modelValue="handleModelUpdate"
      />
    </div>

    <div
      class="flex gap-1 mt-4 justify-between border border-gray-400 rounded items-center bg-gray-300"
      v-if="bookingStore.selectedStationData"
    >
      <div class="text-2xl p-2">{{ monthInView }}</div>
      <div class="flex gap-1 p-2 md:gap-1">
        <ChevronDoubleLeftIcon
          class="size-9 text-white cursor-pointer hover:bg-gray-700 bg-gray-500 rounded px-1"
          @click="handlePreviousWeek"
        />
        <button
          @click="handleCurrentWeekSelection"
          class="cursor-pointer hover:bg-gray-700 text-white bg-gray-500 rounded px-2"
        >
          Today
        </button>
        <ChevronDoubleRightIcon
          class="size-9 hover:bg-gray-700 cursor-pointer text-white bg-gray-500 rounded px-1"
          @click="handleNextWeek"
        />
      </div>
    </div>

    <div class="grid gap-4 grid-cols-1 md:grid-cols-7 md:gap-3 my-2">
      <div
        v-for="date in weeklyDates"
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
              @touchstart.passive="handleTouchStart($event, booking)"
              @touchmove="handleTouchMove"
            >
              <FlagIcon
                class="size-4 flex-shrink-0 mr-1"
                :class="[
                  booking?.isBookingStartDate
                    ? 'text-green-500'
                    : 'text-red-500',
                ]"
              />
              <div class="truncate">
                {{ booking.customerName }}
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div
      class="fixed left-0 justify-between items-center m-2 p-2 rounded cursor-grab bg-amber-200 hover:bg-amber-400 border-2 border-dashed border-gray-500"
      :style="{
        left: touchCoordinates[0] + 'px',
        top: touchCoordinates[1] + 'px',
      }"
      :class="{
        hidden: !touchStarted,
      }"
    >
      <FlagIcon
        class="size-4"
        :class="[
          draggedItem?.isBookingStartDate ? 'text-green-500' : 'text-red-500',
        ]"
      />
      <span>{{ draggedItem?.customerName }}</span>
    </div>
  </div>
</template>
