import React from 'react';
import { useNavigate } from 'react-router-dom'; // React Router v6+ hook

const NotFound: React.FC = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleGoHome = () => {
    navigate('/'); // Navigate back to the homepage
  };

  return (
    <div className="min-h-screen bg-blue-950 text-white flex items-center justify-center">
      <div className="text-center p-8 max-w-lg w-full">
        <div className="text-9xl font-bold text-blue-800 mb-6">404</div>
        <h1 className="text-4xl font-semibold mb-4">Oops! Page not found</h1>
        <p className="text-lg mb-6 text-blue-300">
          Sorry, we couldn't find the page you're looking for. It may have been moved, deleted, or you may have typed the address incorrectly.
        </p>
        <div className="mb-6">
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-blue-800 hover:bg-blue-700 text-lg text-white rounded-[5px] transition duration-300 ease-in-out"
          >
            Go Back to Home
          </button>
        </div>
        <div>
          <p className="text-sm text-blue-400">
            If you believe this is an error, please <a href="mailto:" className="text-blue-300 hover:text-blue-100">contact support</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
