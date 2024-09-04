<script setup lang="ts">
import {ref, watch} from 'vue';

interface Suggestion {
  label: string;
  name: string;
}


const props = defineProps<{
  modelValue: string;
  suggestions: Suggestion[];
}>();

const emit = defineEmits(['update:modelValue', 'input']);

const query = ref(props.modelValue || '');
const showSuggestions = ref(false);

watch(query, (newQuery) => {
  emit('update:modelValue', newQuery);
});

const handleInput = () => {
  showSuggestions.value = true;
  emit('input', query.value);
};

const selectSuggestion = (suggestion:Suggestion) => {
  console.log('ddd:>',suggestion)
  query.value = suggestion.label;
  showSuggestions.value = false;
  emit('update:modelValue', suggestion);
};



</script>

<template>
  <div class="relative">
    <input
        v-model="query"
        @input="handleInput"
        type="text"
        class="w-full p-2 border border-gray-300 rounded"
        placeholder="Search..."
    />
    <ul v-if="showSuggestions && suggestions.length" class="absolute w-full bg-white border border-gray-300 rounded mt-1 z-10">
      <li
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @click="selectSuggestion(suggestion)"
          class="p-2 cursor-pointer hover:bg-gray-100"
      >
        {{ suggestion.label }}
      </li>
    </ul>
  </div>
</template>