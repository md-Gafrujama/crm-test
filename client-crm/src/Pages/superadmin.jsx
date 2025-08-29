import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api'; 
const OTPVerificationForm = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [email, setEmail] = useState('');       
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); 
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    setLoading(true);
    setStatusMessage('Sending OTP...');
    
    try {
      const response = await fetch(`${ API_BASE_URL }/api/superAdmin/send-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ username, password, email }),
      });
      
      const data = await response.json();
      
      if (data.message === 'OTP sent to your email.') {
        setStatusMessage(data.message);
        setStep(2);
      } else {
        setStatusMessage('Failed to send OTP');
      }
    } catch (error) {
      setStatusMessage('Error sending OTP. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setStatusMessage('Verifying OTP...');
    
    try {
      const response = await fetch(`${ API_BASE_URL }/api/superAdmin/verify-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      
      if (data.message === 'OTP verified successfully.') {
        setStatusMessage(data.message);
        
        // Store authentication data
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to superadmin page
        setTimeout(() => {
          window.location.href = '/superadmin';
        }, 1000);
      } else {
        setStatusMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setStatusMessage('Error verifying OTP. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' && !loading) {
      action();
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      {step === 1 && (
        <div>
          <h2>Super Admin Login</h2>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, sendOTP)}
              placeholder="Enter your username"
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
              disabled={loading}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, sendOTP)}
              placeholder="Enter your password"
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
              disabled={loading}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, sendOTP)}
              placeholder="Enter your email"
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
              disabled={loading}
            />
          </div>
          
          <button 
            onClick={sendOTP}
            disabled={loading || !username || !password || !email}
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '16px',
              backgroundColor: (loading || !username || !password || !email) ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              cursor: (loading || !username || !password || !email) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
          
          {statusMessage && (
            <p style={{ 
              marginTop: '15px', 
              color: statusMessage.includes('sent') ? 'green' : 'red' 
            }}>
              {statusMessage}
            </p>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Verify OTP</h2>
          <p>OTP has been sent to: <strong>{email}</strong></p>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Enter OTP:</label>
            <input 
              type="text" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, verifyOTP)}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              style={{ width: '100%', padding: '8px', fontSize: '16px', textAlign: 'center' }}
              disabled={loading}
              autoFocus
            />
          </div>
          
          <button 
            onClick={verifyOTP}
            disabled={loading || otp.length < 6}
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '16px',
              backgroundColor: (loading || otp.length < 6) ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              cursor: (loading || otp.length < 6) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          <button 
            onClick={() => setStep(1)}
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '8px', 
              fontSize: '14px',
              backgroundColor: 'transparent',
              color: '#007bff',
              border: '1px solid #007bff',
              marginTop: '10px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Back to Login
          </button>
          
          {statusMessage && (
            <p style={{ 
              marginTop: '15px', 
              color: statusMessage.includes('successfully') ? 'green' : 'red' 
            }}>
              {statusMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OTPVerificationForm;