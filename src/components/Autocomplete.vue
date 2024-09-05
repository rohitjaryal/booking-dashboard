<script setup lang="ts">
import { ref } from "vue";
import debounce from "lodash/debounce";

interface Suggestion {
  id: string;
  name: string;
}

const props = defineProps<{
  modelValue: Object;
  suggestions: Suggestion[];
  debounceInterval?: number;
}>();

const emit = defineEmits(["update:modelValue", "input"]);

const query = ref(props.modelValue || "");
const showSuggestions = ref(false);
const DEFAULT_DEBOUNCE_INTERVAL = 400;

const intervalOfDebounce = props.debounceInterval ?? DEFAULT_DEBOUNCE_INTERVAL;

const handleInput = debounce(
  () => {
    showSuggestions.value = true;
    emit("input", query.value);
  },
  intervalOfDebounce,
  {
    leading: false,
  },
);

const selectSuggestion = (suggestion: Suggestion) => {
  query.value = suggestion.name;
  showSuggestions.value = false;
  emit("update:modelValue", suggestion);
};
</script>

<template>
  <div class="relative">
    <input
      v-model="query"
      @input="handleInput"
      type="text"
      class="w-full p-2 border border-gray-300 rounded"
      placeholder="Search by station name"
    />
    <ul
      v-if="showSuggestions && suggestions.length"
      class="absolute w-full bg-white border border-gray-300 rounded mt-1 z-10"
    >
      <li
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click="selectSuggestion(suggestion)"
        class="p-2 cursor-pointer hover:bg-gray-100"
      >
        {{ suggestion.name }}
      </li>
    </ul>
  </div>
</template>
