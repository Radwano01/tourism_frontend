import React from 'react';

function VerificationSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
        <p className="text-3xl font-semibold mb-4 text-green-600">Email Verified Successfully!</p>
        <p className="text-gray-600 mb-4">Your email has been verified.</p>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          onClick={() => window.location.href = '/'}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default VerificationSuccess;
