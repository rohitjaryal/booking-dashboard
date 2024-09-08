import { createPinia, setActivePinia } from "pinia";

import useBookingStore from "../../stores/booking.store.ts";

describe("verify Pinia Booking Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("verify station data", () => {
    const bookingStore = useBookingStore();
    expect(bookingStore.selectedStationData).toStrictEqual(null);

    bookingStore.selectedStationData = {
      id: "1",
      name: "test",
      bookings: [
        {
          id: "1",
          pickupReturnStationId: "1",
          customerName: "Test booking",
          startDate: "2021-03-13T22:04:19.032Z",
          endDate: "2021-07-17T08:51:27.402Z",
        },
      ],
    };
    expect(bookingStore.selectedStationData.id).toStrictEqual("1");
  });
});
