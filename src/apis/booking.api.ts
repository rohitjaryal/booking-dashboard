import { fetchRequest } from "../includes/axios.ts";
import { Station } from "../types/booking.types.ts";

interface StationDataPayload {
  query: string;
}

export const getStationData = async (payload: StationDataPayload) => {
  const response = await fetchRequest.get<Station[]>(
    `/stations?name=${payload.query}`,
  );
  return response.data;
};
