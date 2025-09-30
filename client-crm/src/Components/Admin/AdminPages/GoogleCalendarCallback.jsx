import React, { useEffect, useState } from 'react';

const GoogleCalendarCallback = () => {
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    // Get URL parameters to check if authentication was successful
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      setStatus('error');
      setTimeout(() => {
        window.location.href = '/calendar?auth=error';
      }, 3000);
    } else if (success === 'true') {
      setStatus('success');
      setTimeout(() => {
        window.location.href = '/calendar?auth=success';
      }, 2000);
    } else {
      // No clear success/error parameters, assume error
      setStatus('error');
      setTimeout(() => {
        window.location.href = '/calendar?auth=error';
      }, 2000);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Completing Google Calendar authentication...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-green-600">Authentication successful! Redirecting...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <p className="text-red-600">Authentication failed. Redirecting back...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCalendarCallback;
