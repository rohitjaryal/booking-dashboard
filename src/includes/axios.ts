import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRequest = axios.create({
  baseURL: BASE_URL,
});

fetchRequest.defaults.params = {};
fetchRequest.defaults.params = {
  ...fetchRequest.defaults.params,
};
