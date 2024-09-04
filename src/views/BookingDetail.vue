<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getBookingDetails } from "../apis/booking.api.ts";
import dayjs from "dayjs";

const bookingDetails = ref({});

onMounted(() => {
  const data = getBookingDetails("", "");
  bookingDetails.value = data;
});

const bookingDuration = computed(() => {
  if (!bookingDetails.value.startDate || !bookingDetails.value.startDate) {
    return "-";
  }
  const startDate = dayjs(bookingDetails.value.startDate);
  const endDate = dayjs(bookingDetails.value.endDate);
  return `${endDate.diff(startDate, "day")} days`;
});

</script>
<template>
  <div class="bg-white overflow-hidden shadow rounded-lg border">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Booking detail
      </h3>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Customer name</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ bookingDetails.customerName }}
          </dd>
        </div>

        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Booking Start Date</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ bookingDetails.startDate }}
          </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Booking End Date</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ bookingDetails.endDate }}
          </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Booking Duration</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ bookingDuration }}
          </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">
            Pickup-Return Station Name
          </dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ bookingDetails.pickupReturnStationId }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
