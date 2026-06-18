import api from "../api/axios";
import { ENDPOINTS } from "../endpoints";
import { ApiResponse, PaginatedData, Transaction } from "../types";

export const transactionService = {
  getHistory: (customerId: string, page = 0, size = 20) =>
    api.get<ApiResponse<PaginatedData<Transaction>>>(ENDPOINTS.TRANSACTIONS, {
      params: { customerId, page, size },
    }),
  getDetail: (id: number, customerId: string) =>
    api.get<ApiResponse<Transaction>>(`${ENDPOINTS.TRANSACTIONS}/${id}`, {
      params: { customerId },
    }),
};
