<script setup lang="ts">

import {ref} from "vue";
import Autocomplete from "./components/Autocomplete.vue";
import Booking from "./views/Booking.vue";

const searchQuery = ref('');
const results = ref([]);

const handleInput = async (query) => {
  console.log('callled',query);
  if (query.length > 2) {
    // Call your API here and update the results
    // const response = await fetch(`https://api.example.com/search?q=${query}`);
    // results.value = await response.json();
    results.value=[
      {
        label:"hi",
        name:1
      },
      {
        label:"hello",
        name:2
      }
    ]
  } else {
    results.value = [];
  }
};
</script>

<template>
  <div class="flex">
    <Autocomplete
        v-model="searchQuery"
        :suggestions="results"
        @input="handleInput"
    />

  </div>
  <Booking />

</template>
