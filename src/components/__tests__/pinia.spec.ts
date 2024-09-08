import { createPinia, setActivePinia } from "pinia";

import useBookingStore from "../../stores/booking.store.ts";

const TEST_STATION_DATA = {
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

describe("verify Pinia Booking Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("verify station data store", () => {
    const bookingStore = useBookingStore();
    expect(bookingStore.selectedStationData).toStrictEqual(null);

    bookingStore.selectedStationData = TEST_STATION_DATA;
    expect(bookingStore.selectedStationData.id).toStrictEqual(
      TEST_STATION_DATA.id,
    );
    expect(bookingStore.selectedStationData.name).toStrictEqual(
      TEST_STATION_DATA.name,
    );

    expect(bookingStore.selectedStationData.bookings.length).toStrictEqual(
      TEST_STATION_DATA.bookings.length,
    );

    expect(bookingStore.selectedStationData.bookings[0]).toStrictEqual(
      TEST_STATION_DATA.bookings[0],
    );
  });
});
