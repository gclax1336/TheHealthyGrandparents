import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { OTPInput } from 'input-otp';
import { API_ENDPOINTS } from '../config/api';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: phone, 2: otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        setSuccess(true);
      } else {
        setError(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      setError('Invalid OTP.');
    }
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login with Phone</h2>
        {success ? (
          <div className="success-message">
            <p>Login successful!</p>
            <Link to="/membership-main" className="login-button">Go to Member Home</Link>
          </div>
        ) : step === 1 ? (
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
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
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
            <button type="submit" className="login-button" disabled={isLoading || otp.length !== 6}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button type="button" className="back-button" onClick={() => setStep(1)} style={{marginLeft: 8}}>
              Back
            </button>
          </form>
        )}
        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login; 