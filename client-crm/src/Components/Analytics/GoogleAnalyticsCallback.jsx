import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const GoogleAnalyticsCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing Google Analytics connection...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Authorization was denied or failed.');
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received.');
          return;
        }

        // Get company ID and property ID from localStorage or prompt user
        const companyId = localStorage.getItem('companyId');
        const propertyId = prompt('Please enter your Google Analytics 4 Property ID:');

        if (!companyId || !propertyId) {
          setStatus('error');
          setMessage('Missing company ID or property ID.');
          return;
        }

        const token = localStorage.getItem('token');
        
        // Send callback data to backend
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/ga/oauth-callback`,
          { code, companyId, propertyId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStatus('success');
        setMessage('Google Analytics connected successfully!');

        // Close popup after success
        setTimeout(() => {
          window.close();
        }, 2000);

      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage(error.response?.data?.error || 'Failed to connect Google Analytics.');
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connecting...</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-900 mb-2">Success!</h2>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
          </>
        )}
        
        <p className="text-gray-600">{message}</p>
        
        {status !== 'processing' && (
          <button
            onClick={() => window.close()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Close Window
          </button>
        )}
      </div>
    </div>
  );
};

export default GoogleAnalyticsCallback;