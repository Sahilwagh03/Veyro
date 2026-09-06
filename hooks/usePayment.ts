'use client';

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/paymentService';
import { loadRazorpayScript } from '@/utils/loadRazorpay';
import { CreateOrderPayload } from '@/types/payment';

interface UsePaymentParams {
  user: any;
  openAuthModal: (mode?: 'signup' | 'signin') => void;
  showToast: (msg: string) => void;
  onSuccessCallback?: (newCredits: number) => void;
}

export function usePayment({ user, openAuthModal, showToast, onSuccessCallback }: UsePaymentParams) {
  const [isPaying, setIsPaying] = useState(false);
  const queryClient = useQueryClient();

  const verifyMutation = useMutation({
    mutationFn: paymentService.verifyPayment,
    onSuccess: (data) => {
      if (data.success && typeof data.newCredits === 'number') {
        queryClient.setQueryData(['userCredits', user?.id], data.newCredits);
        onSuccessCallback?.(data.newCredits);
        showToast('🎉 Subscribed to Pro! 300 credits added to your account.');
      } else {
        showToast(data.error || 'Payment verification failed. Contact support if debited.');
      }
    },
    onError: (err: any) => {
      console.error('Payment verification error:', err);
      showToast('Error verifying payment.');
    },
    onSettled: () => {
      setIsPaying(false);
    },
  });

  const subscribeToPro = useCallback(
    async (planAmount: number = 99, creditsToAdd: number = 300) => {
      if (!user) {
        openAuthModal('signup');
        return;
      }

      setIsPaying(true);
      try {
        const payload: CreateOrderPayload = {
          amount: planAmount,
          creditsToAdd,
          planName: 'Pro Subscription',
          userId: user.id,
          userEmail: user.email,
        };

        const orderData = await paymentService.createOrder(payload);

        if (!orderData.orderId) {
          throw new Error(orderData.error || 'Failed to create order');
        }

        if (orderData.isMock) {
          const newBal = orderData.newCredits ?? creditsToAdd;
          queryClient.setQueryData(['userCredits', user.id], newBal);
          onSuccessCallback?.(newBal);
          showToast('🎉 Subscribed to Pro! 300 credits added to your account.');
          setIsPaying(false);
          return;
        }

        const resLoaded = await loadRazorpayScript();
        if (!resLoaded) {
          showToast('Razorpay SDK failed to load. Are you online?');
          setIsPaying(false);
          return;
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'Veyro',
          description: `Pro Subscription — ${creditsToAdd} Credits`,
          order_id: orderData.orderId,
          prefill: {
            email: user.email || '',
            name: user.user_metadata?.full_name || '',
            contact: user.user_metadata?.phone || '',
          },
          theme: {
            color: '#f02508',
          },
          handler: async function (response: any) {
            verifyMutation.mutate({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              userId: user.id,
              creditsToAdd,
            });
          },
          modal: {
            ondismiss: function () {
              setIsPaying(false);
            },
          },
        };

        const razorpayObj = new (window as any).Razorpay(options);
        razorpayObj.open();
      } catch (err: any) {
        console.error('Payment initiation error:', err);
        showToast(err?.message || 'Payment initiation failed');
        setIsPaying(false);
      }
    },
    [user, openAuthModal, showToast, onSuccessCallback, queryClient, verifyMutation]
  );

  return {
    isPaying,
    subscribeToPro,
  };
}
