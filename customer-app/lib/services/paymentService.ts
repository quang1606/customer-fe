import api from "../api/axios";
import { ENDPOINTS } from "../endpoints";
import { PaymentRequest, PaymentResult } from "../types";

// Payment API returns response directly (not wrapped in BaseResponse)
export const paymentService = {
  process: (data: PaymentRequest) =>
    api.post<PaymentResult>(ENDPOINTS.PAYMENTS, data),
};
