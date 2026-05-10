import api from "../api/axios";
import { ENDPOINTS } from "../endpoints";
import { ApiResponse, AuthTokens, LoginRequest, RegisterRequest } from "../types";

export const authService = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthTokens>>(ENDPOINTS.AUTH.LOGIN, data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<unknown>>(ENDPOINTS.AUTH.REGISTER, data),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<AuthTokens>>(ENDPOINTS.AUTH.REFRESH, { refreshToken }),
};
