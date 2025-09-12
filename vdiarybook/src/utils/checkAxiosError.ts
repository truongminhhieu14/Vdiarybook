import HttpStatusCode from "@/constant/statusCode";
import axios, { AxiosError } from "axios";


export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isUnprocessableEntity<FormErorr>(error: unknown): error is AxiosError<FormErorr> {
  return isAxiosError<FormErorr>(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}