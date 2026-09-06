import { apiClient } from './apiClient';
import {
  CreateOrderPayload,
  CreateOrderResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from '@/types/payment';

export const paymentService = {
  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const { data } = await apiClient.post<CreateOrderResponse>('/api/payment/create-order', payload);
    return data;
  },

  async verifyPayment(payload: VerifyPaymentPayload): Promise<VerifyPaymentResponse> {
    const { data } = await apiClient.post<VerifyPaymentResponse>('/api/payment/verify', payload);
    return data;
  },
};
