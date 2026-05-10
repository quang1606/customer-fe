import api from "../api/axios";
import { ENDPOINTS } from "../endpoints";
import { ApiResponse, User } from "../types";

export const profileService = {
  get: () => api.get<ApiResponse<User>>(ENDPOINTS.PROFILE.GET),

  update: (data: { firstName: string; lastName: string; email: string; phone?: string }) =>
    api.put<ApiResponse<User>>(ENDPOINTS.PROFILE.UPDATE, data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<ApiResponse<unknown>>(ENDPOINTS.PROFILE.PASSWORD, data),
};
