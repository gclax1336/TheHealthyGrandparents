import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51RdCw8RCwgGZn0bRV67VuSN2zgwyNidQrbkYiBvfbzZpSmau1XS4I3pLOeib140jNMT0db77YnEDIovvS09p49e100W0SJpHgl');

function CheckoutForm() {
  const [discountCode, setDiscountCode] = useState('');
  const [amount, setAmount] = useState(100); // Example: $100
  const [message, setMessage] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const phone = localStorage.getItem('phone') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call backend to create payment intent
    const res = await fetch('/api/payment/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, discountCode, phone }),
    });
    const data = await res.json();

    if (data.free) {
      setMessage('Discount applied! You get it for free.');
      navigate('/payment-result?status=success');
      return;
    }

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setMessage(result.error.message);
      navigate('/payment-result?status=failed');
    } else if (result.paymentIntent.status === 'succeeded') {
      setMessage('Payment successful!');
      navigate('/payment-result?status=success');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <input
        type="text"
        placeholder="Discount Code"
        value={discountCode}
        onChange={e => setDiscountCode(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
      <button type="submit" disabled={!stripe} style={{ marginTop: 20 }}>Pay</button>
      <div style={{ marginTop: 10 }}>{message}</div>
    </form>
  );
}

export default function PaymentForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
} 