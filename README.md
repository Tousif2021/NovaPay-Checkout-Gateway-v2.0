# NovaPay Checkout Gateway

> A production-ready, animated, multi-step payment checkout component for React.
> Built by **Tousif** — Computer Science student at KTH Royal Institute of Technology, Stockholm.

---

## What Is This?

NovaPay is a **complete 5-step checkout flow** packaged as a single React component. It handles the entire purchase journey — cart review, shipping address, payment method selection, delivery options, order review, and confirmation — with polished animations and a dark-mode UI designed for real-world e-commerce integration.

This is not a template. It is an **integration-ready pipeline** — wire it to your backend, swap in your payment processor SDK, and you have a working checkout.

---

## Features

### Checkout Flow
- **Step 1 — Cart:** Item list with quantity controls, product ratings, remove functionality, and a working promo code system (`NOVA20`, `WELCOME10`, `SHIP50`)
- **Step 2 — Shipping Address:** Floating-label inputs with per-field validation, autocomplete support, and no focus-loss bugs
- **Step 3 — Payment:** 7 payment methods with branded logos and contextual UI
- **Step 4 — Delivery:** Standard / Express / Next Day with pricing badges
- **Step 5 — Review & Confirm:** Full order summary with breakdown before final purchase

### Supported Payment Methods
| Method | Type | Integration Point |
|--------|------|-------------------|
| Credit/Debit Card | Visa, Mastercard, Amex | Stripe `paymentIntents` / Adyen |
| Klarna | Buy Now Pay Later (3 instalments) | Klarna Payments SDK |
| Stripe Link | One-click saved cards | Stripe.js + Link |
| Apple Pay | Biometric wallet | Stripe / Adyen Apple Pay |
| Google Pay | Google wallet | Google Pay API |
| PayPal | Balance / linked card | PayPal JS SDK |
| Swish | Swedish mobile banking | Swish API (Getswish) |

### UI/UX
- **Animated 3D credit card preview** — live updates as you type, flips to show CVC on back
- **Floating label inputs** — labels animate up on focus, no re-mount focus loss
- **Step-by-step progress bar** — clickable, with animated checkmarks for completed steps
- **Professional confirmation screen** — order timeline, shipping summary, no confetti
- **Responsive** — stacks to single-column on mobile (< 920px)
- **Dark theme** — indigo/slate palette, designed for modern storefronts

### Technical
- Single-file React component (`.jsx`) — zero external dependencies beyond React
- `memo`'d input components for performance
- CSS keyframe animations injected once (no CSS file needed)
- Google Fonts loaded via CSS import (Outfit + JetBrains Mono)
- 25% VAT calculation (Swedish standard, configurable)
- Per-step form validation with inline error states

---

## Quick Start

### 1. Drop into your React project

```bash
cp payment-gateway.jsx src/components/PaymentGateway.jsx
```

### 2. Import and render

```jsx
import PaymentGateway from './components/PaymentGateway';

function App() {
  return <PaymentGateway />;
}
```

### 3. That's it

The component renders the full checkout with sample data. See the Integration Guide below (or `NovaPay_Integration_Manual.pdf`) to wire it to your real backend.

---

## Integration Guide

### Connecting Your Cart

Replace `INIT_CART` with your store's cart state:

```jsx
// Before (sample data)
const INIT_CART = [
  { id:1, name:"Sony WH-1000XM5", variant:"Midnight Black", price:349.99, qty:1, img:"🎧", rating:4.8 },
];

// After (your store)
import { useCartStore } from '@/stores/cart';

export default function PaymentGateway() {
  const cart = useCartStore(state => state.items);
  // ... rest of component uses `cart`
}
```

### Wiring Payment Processing

Replace the `handlePurchase` function:

```jsx
// Current (mock)
const handlePurchase = async () => {
  setProcessing(true);
  await new Promise(r => setTimeout(r, 3200));
  setProcessing(false);
  setCompleted(true);
};

// Stripe integration example
const handlePurchase = async () => {
  setProcessing(true);
  try {
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(total * 100), currency: 'sek' }),
    });
    const { clientSecret } = await res.json();

    if (method === 'card') {
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement }
      });
      if (error) throw error;
    }
    // Handle Klarna, Apple Pay, etc. via their respective SDKs
    setCompleted(true);
  } catch (err) {
    setErrors({ payment: err.message });
  } finally {
    setProcessing(false);
  }
};
```

### Configuring Tax & Currency

```jsx
// Change these in the main component:
const TAX_RATE = 0.25;        // Swedish 25% VAT — change to your rate
const CURRENCY = 'USD';       // Change to 'SEK', 'EUR', etc.
const CURRENCY_SYMBOL = '$';  // Change to 'kr', '€', etc.
```

### Promo Code Validation

Replace the local `PROMO_CODES` object with an API call:

```jsx
const applyPromo = async (code) => {
  const res = await fetch(`/api/promo/validate?code=${code}`);
  const { valid, discount } = await res.json();
  if (valid) {
    setPromo(code);
    setPromoApplied(true);
    setDiscount(discount);
  } else {
    setPromoError('Invalid promo code.');
  }
};
```

---

## File Structure

```
novapay-checkout-gateway/
├── payment-gateway.jsx          # The complete checkout component
├── NovaPay_Integration_Manual.pdf  # Detailed PDF manual
├── README.md                    # This file
└── LICENSE                      # MIT License
```

---

## Tech Stack

- **React 18+** (hooks, memo)
- **CSS-in-JS** (inline styles + injected keyframes)
- **Google Fonts** (Outfit, JetBrains Mono)
- **Zero dependencies** beyond React

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Safari | 14+ |
| Chrome Android | 90+ |

---

## License

MIT License. See `LICENSE` file.

---

## Author

**Tousif** — Built as part of a frontend engineering portfolio project.

- KTH Royal Institute of Technology, Stockholm
- Computer Science & Engineering (Datateknik), Class of 2027

---

> If you use NovaPay in your project, a star on the repo is appreciated.
