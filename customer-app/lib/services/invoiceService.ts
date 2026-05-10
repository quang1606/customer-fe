import api from "../api/axios";
import { ENDPOINTS } from "../endpoints";
import { ApiResponse, PaginatedData, Invoice } from "../types";

export const invoiceService = {
  getAll: (params: { page?: number; size?: number; nameStore?: string; title?: string }) =>
    api.get<ApiResponse<PaginatedData<Invoice>>>(ENDPOINTS.INVOICES, { params }),
};
