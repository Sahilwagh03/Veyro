export interface CreateOrderPayload {
  amount: number;
  creditsToAdd: number;
  planName?: string;
  userId?: string;
  userEmail?: string;
}

export interface CreateOrderResponse {
  orderId?: string;
  keyId?: string;
  amount?: number;
  currency?: string;
  isMock?: boolean;
  newCredits?: number;
  error?: string;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId: string;
  signature?: string;
  userId: string;
  creditsToAdd: number;
  isMock?: boolean;
}

export interface VerifyPaymentResponse {
  success: boolean;
  newCredits?: number;
  credits?: number;
  error?: string;
}
