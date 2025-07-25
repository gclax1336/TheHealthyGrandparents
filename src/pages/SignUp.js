import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OTPInput } from 'input-otp';
import { API_ENDPOINTS } from '../config/api';

function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: phone, 2: otp, 'complete': done
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.auth.requestOtp, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Failed to send OTP.');
    }
    setIsLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.auth.verifyOtp, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('phone', phone);
        if (!data.has_paid) {
          navigate('/checkout');
        } else {
          setSuccessMsg('Registration complete! You are now logged in.');
          setStep('complete');
        }
      } else {
        setError(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      setError('Invalid OTP.');
    }
    setIsLoading(false);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up with Phone</h2>
        {step === 1 && (
          <form onSubmit={handlePhoneSubmit}>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                placeholder="e.g. +1234567890"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <OTPInput
                maxLength={6}
                value={otp}
                onChange={setOtp}
                inputMode="numeric"
                autoFocus
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button" disabled={isLoading || otp.length !== 6}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button type="button" className="back-button" onClick={() => setStep(1)} style={{marginLeft: 8}}>
              Back
            </button>
          </form>
        )}
        {step === 'complete' && (
          <div className="form-step">
            <h2>Registration Complete!</h2>
            <p>{successMsg}</p>
            <button className="login-button" onClick={() => navigate('/membership-main')}>Go to Member Home</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp; 