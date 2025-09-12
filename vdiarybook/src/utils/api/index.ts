import { IRefreshToken } from "@/types/auth.type";
import { SuccessResponse } from "@/types/response";
import { getRefreshTokenFormLocalStorage, getUserIdFromLocalStorage } from "../auth";
import http from "../../services/api.service"

export const getNewAccessToken = async () => {
  const response = await http
    .post<SuccessResponse<IRefreshToken>>("/auth/getNewAccessToken", {
      refreshToken: getRefreshTokenFormLocalStorage(),
    }, {
      headers: {
        'x-client-id': getUserIdFromLocalStorage()
      }
    })    
    return response.data.metadata.accessToken
};