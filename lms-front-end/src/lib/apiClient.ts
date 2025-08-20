// src/lib/apiClient.ts
import { authKey } from "@/constants/storageKey";
import { getFromLocalStorage } from "@/util/local-storage";
import axios from "axios";

 const accessToken = getFromLocalStorage(authKey)
const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
});

export default apiClient;
