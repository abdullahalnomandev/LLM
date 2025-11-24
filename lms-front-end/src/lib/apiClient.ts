// src/lib/apiClient.ts
import { authKey } from "@/constants/storageKey";
import { getFromLocalStorage } from "@/util/local-storage";
import axios from "axios";


const apiClient = axios.create({
  baseURL: "http://localhost:9000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  function (config) {

    const accessToken = getFromLocalStorage(authKey);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default apiClient;
