import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRequest = axios.create({
  baseURL: BASE_URL,
});

// fetchRequest.interceptors.request.use(
//   (config) => {
//     const loaderStore = useLoaderStore();
//
//     loaderStore.isLoading = true;
//     return config;
//   },
//   (error) => {
//     console.error(error);
//     return Promise.reject(error);
//   }
// );
//
// fetchRequest.interceptors.response.use(
//   (response) => {
//     const loaderStore = useLoaderStore();
//     loaderStore.isLoading = false;
//     return response;
//   },
//   (error) => {
//     const loaderStore = useLoaderStore();
//     loaderStore.isLoading = false;
//     console.error(error);
//     return Promise.reject(error.message);
//   }
// );

fetchRequest.defaults.params = {};
fetchRequest.defaults.params = {
  ...fetchRequest.defaults.params,
};
