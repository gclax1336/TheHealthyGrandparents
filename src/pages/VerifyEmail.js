import React, { useEffect, useState } from 'react';

export default function VerifyEmail() {
  const [message, setMessage] = useState('Verifying...');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    fetch(`/api/auth/verify?token=${token}`)
      .then(res => res.json())
      .then(data => setMessage(data.message || 'Verification complete!'))
      .catch(() => setMessage('Verification failed.'));
  }, []);
  return <div style={{ padding: 40, textAlign: 'center' }}><h2>{message}</h2></div>;
} 