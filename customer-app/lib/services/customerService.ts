import api from "../api/axios";
import { ENDPOINTS } from "../endpoints";
import { ApiResponse, CustomerProfile } from "../types";

export const customerService = {
  getProfile: (id: string) =>
    api.get<ApiResponse<CustomerProfile>>(ENDPOINTS.CUSTOMERS.PROFILE(id)),
};
