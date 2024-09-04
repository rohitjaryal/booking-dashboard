import { createRouter, createWebHistory } from "vue-router";

const Booking = () => import("../views/Booking.vue");
const BookingDetail = () => import("../views/BookingDetail.vue");

const routes = [
  {
    name: "booking",
    path: "/",
    component: Booking,
  },
  {
    name: "detail",
    path: "/detail/stations/:stationId?/bookings/:bookingId",
    component: BookingDetail,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "booking" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

export default router;
