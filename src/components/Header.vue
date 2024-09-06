<template>
  <nav>
    <div class="mx-auto px-2 lg:px-2 bg-gray-100">
      <div class="relative flex h-16 items-center border-b border-gray-200">
        <div class="flex items-center">
          <div class="lg:ml-4 lg:block">
            <div class="flex space-x-4">
              <router-link
                custom
                :to="{
                  name: 'booking',
                }"
                v-slot="{ navigate }"
              >
                <button
                  class="bg-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-400"
                  aria-current="page"
                  @click="navigate"
                >
                  Bookings
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts"></script>
