import api from "../api/axios";
import { ENDPOINTS } from "../endpoints";
import { ApiResponse, PaginatedData, AvailableVoucher, MyVoucher, ApplicableVoucher } from "../types";

export const voucherService = {
  getAvailable: (customerId: string, page = 0, size = 20) =>
    api.get<ApiResponse<PaginatedData<AvailableVoucher>>>(ENDPOINTS.VOUCHERS.AVAILABLE, {
      params: { customerId, page, size },
    }),

  collect: (voucherId: number, customerId: string) =>
    api.post<ApiResponse<string>>(ENDPOINTS.VOUCHERS.COLLECT(String(voucherId)), null, {
      params: { customerId },
    }),

  getMyVouchers: (customerId: string, status?: string, page = 0, size = 20) =>
    api.get<ApiResponse<PaginatedData<MyVoucher>>>(ENDPOINTS.VOUCHERS.LIST, {
      params: { customerId, status, page, size },
    }),

  getApplicable: (customerId: string, nameStore: string, orderAmount: number) =>
    api.get<ApiResponse<{ data: ApplicableVoucher[]; totalElements: number }>>(ENDPOINTS.VOUCHERS.APPLICABLE, {
      params: { customerId, nameStore, orderAmount },
    }),
};
