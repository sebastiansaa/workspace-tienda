import { axiosAdapter } from "@/shared/api/axiosAdapter";
import type { AxiosResponse } from "axios";
import type { DashboardStatsResponse } from "../interfaces";

export const adminApi = {
  // Dashboard
  getDashboardStats: (): Promise<AxiosResponse<DashboardStatsResponse>> => axiosAdapter.get('/admin/dashboard'),
};
