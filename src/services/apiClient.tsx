import axios, { AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";

let retryCount = 0;

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://api-annual.uef.edu.vn/",
  // baseURL: "http://localhost:5215/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("s_t");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    retryCount = 0;
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401 && retryCount < 2) {
      retryCount++;
      const keyRefreshToken = Cookies.get("s_r");
      if (keyRefreshToken && keyRefreshToken !== undefined) {
        try {
          const res: AxiosResponse = await apiClient.put(
            `api/auth/refresh/${keyRefreshToken}`
          );
          const expires = new Date(res.data.expiresAt * 1000);
          const expiresRefresh = new Date(res.data.expiresAt * 1000);
          expiresRefresh.setDate(expiresRefresh.getDate() + 7);
          Cookies.set("s_t", res.data.accessToken, { expires: expires });
          Cookies.set("s_r", res.data.refreshToken, {
            expires: expiresRefresh,
          });

          error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return apiClient.request(error.config);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      } else {
        await signOut({ callbackUrl: "/login" });
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
