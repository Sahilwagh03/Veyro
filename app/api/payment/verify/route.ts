import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '@/utils/supabase/admin';

function getDbClient() {
  const admin = getSupabaseAdmin();
  if (admin) return admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anonKey) {
    return createClient(url, anonKey);
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { orderId, paymentId, signature, userId, creditsToAdd, isMock } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Handle mock demo payments when keys are not yet configured
    if (isMock || !keySecret) {
      const dbClient = getDbClient();
      let updatedCredits = Number(creditsToAdd) || 100;

      if (dbClient && userId && userId !== 'anonymous') {
        const { data } = await dbClient.rpc('increment_credits', {
          user_id: userId,
          amount: Number(creditsToAdd),
        });
        if (typeof data === 'number') {
          updatedCredits = data;
        }
      }

      return NextResponse.json({
        success: true,
        isMock: true,
        newCredits: updatedCredits,
        message: 'Mock payment verified successfully.',
      });
    }

    // 1. Verify Razorpay cryptographic HMAC SHA256 signature
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature. Verification failed.' },
        { status: 400 }
      );
    }

    // 2. Add credits to user in database via Supabase
    const dbClient = getDbClient();
    let updatedCredits = Number(creditsToAdd) || 100;

    if (dbClient && userId && userId !== 'anonymous') {
      const { data, error } = await dbClient.rpc('increment_credits', {
        user_id: userId,
        amount: Number(creditsToAdd),
      });

      if (error) {
        console.error('Supabase increment_credits RPC error:', error);
      } else if (typeof data === 'number') {
        updatedCredits = data;
      }
    }

    return NextResponse.json({
      success: true,
      newCredits: updatedCredits,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error?.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
