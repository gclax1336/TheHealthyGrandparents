import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const status = params.get('status');

  if (status === 'success') {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Thank you! Your payment was successful.</h2>
        <p>You now have full access to The Healthy Grandparent platform.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Sorry, your payment failed.</h2>
      <p>Please try again.</p>
      <button onClick={() => navigate('/checkout')}>Retry Payment</button>
    </div>
  );
} 