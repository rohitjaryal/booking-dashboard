<script setup lang="ts">
import dayjs from 'dayjs';
import {computed, ref} from 'vue';

const TOTAL_DAYS_IN_WEEK = 7;

const beginningOfWeek=ref(dayjs(dayjs()).startOf('week').add(1,'day'));

const dates=computed(()=>{
  return Array.from({ length: TOTAL_DAYS_IN_WEEK }, (_, i) => {
    const selectedWeekFirstDate=beginningOfWeek.value;
    const newDate=dayjs(selectedWeekFirstDate).add(i,'day');
    return {
      date: newDate,
      dayNameShort:newDate.format('ddd'),
      dayNumber:newDate.format('DD'),
      dateFormatted:newDate.format('YYYY-MM-DD'),
    };
  });
})

const monthInView=computed(()=>{
  return `${beginningOfWeek.value.format('MMMM')} ${beginningOfWeek.value.format('YYYY')}`;
})

function handlePreviousWeek(){
  beginningOfWeek.value=dayjs(beginningOfWeek.value).add(-1,'week');
}

function handleNextWeek(){
  beginningOfWeek.value=dayjs(beginningOfWeek.value).add(1,'week');
}

</script>

<template>
  <div class="bg-amber-100 p-4 mx-auto w-full">
    <div class="text-red-900 bg-amber-400">{{ monthInView }}</div>
    <div><button class="bg-red-500" @click="handlePreviousWeek">previous week</button></div>
    <div><button class="bg-red-500" @click="handleNextWeek">next week</button></div>
    <div class="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-500 mb-2">
      <span v-for="day in dates" :key="day.dateFormatted" :class="[
        'p-2 rounded text-center',
        day.date.isSame(dayjs(), 'day') ? 'bg-red-500 text-white' : 'bg-gray-100'
      ]">{{ day.dayNameShort }}  {{ day.dayNumber}}</span>
    </div>
    <div class="grid grid-cols-7 gap-4">
      <div
          v-for="date in dates"
          :key="date.dateFormatted"
          class="p-2 text-center border rounded cursor-pointer hover:bg-gray-200"
      >
        {{ date.dayNumber }}
      </div>
    </div>
  </div>
</template>