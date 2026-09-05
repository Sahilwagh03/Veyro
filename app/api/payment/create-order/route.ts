import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = Number(body?.amount);
    const creditsToAdd = Number(body?.creditsToAdd);
    const userId = body?.userId;
    const planName = body?.planName;

    if (!amount || !creditsToAdd) {
      return NextResponse.json({ error: 'Amount and creditsToAdd are required' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Graceful demo mode if keys are not yet configured in .env.local
    if (!keyId || !keySecret) {
      return NextResponse.json({
        orderId: `order_demo_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: 'INR',
        isMock: true,
        keyId: 'rzp_test_demo',
        message: 'Operating in demo mode. Configure RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in .env.local to go live.',
      });
    }

    const RazorpayConstructor: any = (Razorpay as any)?.default || Razorpay;
    const razorpay = new RazorpayConstructor({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // amount in paise (₹1 = 100 paise)
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: userId || 'anonymous',
        creditsToAdd: String(creditsToAdd),
        planName: planName || 'Credits Top-Up',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      isMock: false,
    });
  } catch (error: any) {
    console.error('Error in create-order route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
