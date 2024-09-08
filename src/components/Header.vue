<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();

const isHomePage = computed(() => {
  return router?.currentRoute?.value?.path === "/";
});
</script>

<template>
  <nav>
    <div class="mx-auto px-2 lg:px-2 bg-indigo-300">
      <div class="relative flex h-16 items-center border-b border-gray-200">
        <div class="flex items-center">
          <div class="lg:ml-4 lg:block">
            <div class="flex space-x-4">
              <div>
                <router-link
                  custom
                  :to="{
                    name: 'booking',
                  }"
                  v-slot="{ navigate }"
                >
                  <button
                    class="px-4 py-2 rounded-md font-medium hover:bg-indigo-500 bg-gray-100"
                    aria-current="page"
                    @click="navigate"
                  >
                    Bookings
                  </button>
                </router-link>
              </div>
              <div>
                <router-link
                  custom
                  :to="{
                    name: 'booking',
                  }"
                  v-slot="{ navigate }"
                >
                  <button
                    class="px-4 py-2 rounded-md font-medium hover:bg-indigo-500 bg-gray-100"
                    aria-current="page"
                    @click="navigate"
                    :class="{
                      hidden: isHomePage,
                    }"
                  >
                    Back
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
