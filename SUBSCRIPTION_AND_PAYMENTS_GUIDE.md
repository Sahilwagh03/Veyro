# Veyro: Minimal-Backend Auth, Credits & Payment Architecture

This guide details how to implement user management, persistent credits, and Razorpay payments with minimal backend code using **Next.js App Router**, **Supabase (Auth + DB)**, and **Razorpay Standard Checkout**.

---

## 1. Architecture Overview

- **Auth & Database**: [Supabase](https://supabase.com) (handles Google/Email logins, JWT sessions, and hosted PostgreSQL with zero custom server logic).
- **Payment Gateway**: [Razorpay](https://razorpay.com) (handles UPI, GPay, QR code, Cards, NetBanking via standard popup modal).
- **Backend Footprint**: Exactly **2 lightweight Next.js route handlers** (`create-order` and `verify`).

```
[User Browser]
   │
   ├─► 1. Sign in with Google (Supabase Auth) ──────────────► [Supabase Auth]
   │                                                             │
   │                                                             ▼
   │                                                   Creates Profile (30 Credits)
   │
   ├─► 2. Click "Top-up Credits" ──► POST /api/payment/create-order
   │                                                │
   │                                                ▼
   │                                        Creates Razorpay Order
   │
   ├─► 3. Opens Razorpay Popup (UPI/Cards) ◄─────── Order ID
   │
   ├─► 4. User Pays Successfully ──────────────────► Razorpay
   │
   └─► 5. Sends Verification ──────► POST /api/payment/verify
                                                    │
                                                    ▼
                                            Verifies Signature &
                                            Increments Credits in DB
```

---

## 2. Environment Variables (`.env.local`)

Add these keys to your `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # Server-only!

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

---

## 3. Database Schema (Run in Supabase SQL Editor)

Run this SQL once in your Supabase dashboard (**SQL Editor** tab):

```sql
-- 1. Create a profiles table linked to Supabase Auth
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  credits integer default 30 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can view own profile" 
on public.profiles for select 
using (auth.uid() = id);

-- 3. Trigger: Automatically grant 30 free credits on sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, credits)
  values (new.id, new.email, 30);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Atomic function to safely increment/decrement credits
create or replace function public.increment_credits(user_id uuid, amount integer)
returns integer as $$
declare
  updated_credits integer;
begin
  update public.profiles
  set credits = greatest(0, credits + amount)
  where id = user_id
  returning credits into updated_credits;

  return updated_credits;
end;
$$ language plpgsql security definer;
```

---

## 4. Dependencies Installation

```bash
npm install @supabase/supabase-js razorpay
npm install -D @types/razorpay
```

---

## 5. Backend Route Handlers

### Route 1: Create Order
File: `app/api/payment/create-order/route.ts`

```ts
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount, creditsToAdd, userId } = await req.json();

    const options = {
      amount: amount * 100, // amount in paise (e.g. 499 INR = 49900 paise)
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId,
        creditsToAdd: String(creditsToAdd),
      },
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
```

### Route 2: Verify Payment & Add Credits
File: `app/api/payment/verify/route.ts`

```ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with admin access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { orderId, paymentId, signature, userId, creditsToAdd } = await req.json();

    // 1. Verify Razorpay cryptographic signature
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature verification' }, { status: 400 });
    }

    // 2. Increment credits using the safe database function
    const { data: newCredits, error } = await supabaseAdmin.rpc('increment_credits', {
      user_id: userId,
      amount: Number(creditsToAdd),
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, newCredits });
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
```

---

## 6. Client-side Integration Helper

### Script Loader: `utils/loadRazorpay.ts`
```ts
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
```

### Checkout Trigger Example (Inside React Component):
```tsx
import { loadRazorpayScript } from '@/utils/loadRazorpay';

interface Plan {
  name: string;
  inr: number;
  credits: number;
}

export const TOPUP_PLANS: Plan[] = [
  { name: 'Starter Pack', inr: 499, credits: 100 },
  { name: 'Growth Pack', inr: 1199, credits: 300 },
  { name: 'Agency Pack', inr: 2499, credits: 800 },
];

async function handlePurchase(plan: Plan, userId: string, onSuccess: (credits: number) => void) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert('Razorpay SDK failed to load. Please check your internet.');
    return;
  }

  // 1. Create order
  const res = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: plan.inr,
      creditsToAdd: plan.credits,
      userId,
    }),
  });

  const { orderId } = await res.json();

  // 2. Open Razorpay Checkout Modal
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: plan.inr * 100,
    currency: 'INR',
    name: 'Veyro',
    description: `${plan.name} — ${plan.credits} Credits`,
    order_id: orderId,
    handler: async (response: any) => {
      // 3. Verify payment
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          userId,
          creditsToAdd: plan.credits,
        }),
      });

      const data = await verifyRes.json();
      if (data.success) {
        onSuccess(data.newCredits);
      }
    },
    theme: {
      color: '#f02508', // Matches Veyro brand red
    },
  };

  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();
}
```

---

## 7. Zero-Code Alternative: Merchant of Record (MoR)

If you prefer **not to write any verification code or handle tax/GST manually**:

- **Dodo Payments** or **Polar.sh** / **LemonSqueezy**:
  1. Create a product link (e.g. `https://buy.polar.sh/veyro-100-credits`).
  2. Send the `userId` in the checkout query param.
  3. Their webhook updates your database automatically.
