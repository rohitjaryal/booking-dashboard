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
      booking: [],
    };
    expect(bookingStore.selectedStationData.id).toStrictEqual("1");
  });
});
