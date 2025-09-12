import { ILogin, IRegister, IUpdateProfile, User, UsersResponse } from "@/types/auth.type";
import http from "./api.service";
import {
  getAccessTokenFormLocalStorage,
  getRefreshTokenFormLocalStorage,
  getUserIdFromLocalStorage,
} from "@/utils/auth";
import { SuccessResponse } from "@/types/response";

const authApi = {
  signIn: async (data: ILogin) => await http.post("auth/login", data),
  signUp: async (data: IRegister) =>
    await http.post("/auth/register", data),
  logOut: async () =>
    await http.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
          "x-client-id": getUserIdFromLocalStorage(),
        },
      }
    ),

  getAllUsers: async (page: number = 1, limit: number = 10): Promise<User[]> => {
    const { data } = await http.get<UsersResponse>("/auth/users", {params: { page, limit }})
    return data.users
  },

  getProfile: async (): Promise<any> =>
    await http.get("/auth/get-profile"),
  
  getProfileById: async (userId: string): Promise<any> =>
    await http.get(`/auth/get-profile/${userId}`, {}),  
  
  updateProfile: async (data: IUpdateProfile): Promise<any> =>
    await http.patch("/auth/update-profile", data),
};

export default authApi;