import HttpStatusCode from "@/constant/statusCode";
import { authResponse } from "@/types/response";
import { getNewAccessToken } from "@/utils/api";
import {
  clearLocalStorage,
  getAccessTokenFormLocalStorage,
  getUserIdFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
  setUserIdToLocalStorage,
} from "@/utils/auth";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const axiosApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

class ApiService {
  private accessToken: string;
  axiosInstance: AxiosInstance = axiosApiInstance;
  private isFetchingAccessToken = false;
  constructor() {
    this.accessToken = getAccessTokenFormLocalStorage();
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = getAccessTokenFormLocalStorage();
        const userId = getUserIdFromLocalStorage();

        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        if (userId) {
          config.headers["x-client-id"] = userId;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.axiosInstance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (url === "/auth/login") {
          const data = response.data as authResponse;
          this.accessToken = data.metadata?.accessToken;
          setAccessTokenToLocalStorage(this.accessToken);
          setRefreshTokenToLocalStorage(data.metadata?.refreshToken);
          setUserIdToLocalStorage(data.metadata.user._id);
        } else if (
          url === "/auth/logout" &&
          response.status === HttpStatusCode.Ok
        ) {
          this.accessToken = "";
          clearLocalStorage();
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalConfig = error.config as InternalAxiosRequestConfig;

        if (error.response?.status === HttpStatusCode.Unauthorized) {
          if(this.isFetchingAccessToken) {
            return Promise.reject(error);
          }
          this.isFetchingAccessToken = true;
          try {
            const newAccessToken = await getNewAccessToken();
            setAccessTokenToLocalStorage(newAccessToken);
            this.accessToken = newAccessToken;
            originalConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return this.axiosInstance.request(originalConfig);
          } catch (err) {
            clearLocalStorage();
            return Promise.reject(err);
          } finally {
            this.isFetchingAccessToken = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

export default new ApiService().axiosInstance;
