<script setup lang="ts">
import { ref } from "vue";
import debounce from "lodash/debounce";

interface Suggestion {
  id: string;
  name: string;
}

interface Props {
  modelValue: any;
  suggestions: Suggestion[];
  debounceInterval?: number;
  inputClass?: string; // Sample param :input-class="'bg-green-500 border-4 border-red-500'"
  suggestionsClass?: string;
  suggestionItemClass?: string;
}

const {
  debounceInterval = 400,
  suggestions,
  modelValue,
  inputClass = "",
  suggestionsClass = "",
  suggestionItemClass = "",
} = defineProps<Props>();

const emit = defineEmits(["update:modelValue", "input"]);

const query = ref(modelValue);
const showSuggestions = ref(false);

const handleInput = debounce(
  () => {
    showSuggestions.value = true;
    emit("input", query.value);
  },
  debounceInterval,
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
      :class="[inputClass]"
      placeholder="Search by station name"
    />
    <ul
      v-if="showSuggestions && suggestions.length"
      class="absolute w-full bg-white border border-gray-300 rounded mt-1 z-10"
      :class="[suggestionsClass]"
    >
      <li
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click="selectSuggestion(suggestion)"
        class="p-2 cursor-pointer hover:bg-gray-100"
        :class="[suggestionItemClass]"
      >
        {{ suggestion.name }}
      </li>
    </ul>
  </div>
</template>
