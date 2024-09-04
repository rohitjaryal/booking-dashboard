<template>
  <nav x-data="{ open: false }" class="bg-gray-50">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center border-b border-gray-200">
        <div class="flex items-center">
          <!-- Links section -->
          <div class="hidden lg:ml-10 lg:block">
            <div class="flex space-x-4">
              <router-link
                custom
                :to="{
                  name: 'booking',
                }"
                v-slot="{ navigate }"
              >
                <button
                  class="bg-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-900"
                  aria-current="page"
                  @click="navigate"
                >
                  Booking
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      x-description="Mobile menu, show/hide based on menu state."
      class="border-b border-gray-200 bg-gray-50 lg:hidden"
      id="mobile-menu"
      x-show="open"
    >
      <div class="space-y-1 px-2 pt-2 pb-3">
        <a
          href="#"
          class="bg-gray-100 block px-3 py-2 rounded-md font-medium text-gray-900"
          aria-current="page"
          x-state:on="Current"
          x-state:off="Default"
          x-state-description='Current: "bg-gray-100", Default: "hover:bg-gray-100"'
          >Dashboard</a
        >

        <a
          href="#"
          class="hover:bg-gray-100 block px-3 py-2 rounded-md font-medium text-gray-900"
          x-state-description='undefined: "bg-gray-100", undefined: "hover:bg-gray-100"'
          >Jobs</a
        >

        <a
          href="#"
          class="hover:bg-gray-100 block px-3 py-2 rounded-md font-medium text-gray-900"
          x-state-description='undefined: "bg-gray-100", undefined: "hover:bg-gray-100"'
          >Applicants</a
        >

        <a
          href="#"
          class="hover:bg-gray-100 block px-3 py-2 rounded-md font-medium text-gray-900"
          x-state-description='undefined: "bg-gray-100", undefined: "hover:bg-gray-100"'
          >Company</a
        >
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts"></script>
