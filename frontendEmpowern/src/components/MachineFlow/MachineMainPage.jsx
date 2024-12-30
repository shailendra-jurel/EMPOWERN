import React from 'react';
import { Link } from 'react-router-dom';
import { FaTools } from 'react-icons/fa';

const MachineMainPage = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 min-h-screen flex flex-col items-center justify-center text-center">
      {/* Coming Soon Section */}
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center">
          <FaTools className="text-indigo-600 text-6xl mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-4">Coming Soon!</h1>
          <p className="text-sm sm:text-base text-gray-600">
            We're working hard to bring you the best tools and machine rental experience. Stay tuned for updates!
          </p>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <Link
            to="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
          >
            Go to Home
          </Link>
          <Link
            to="/labor/main-page"
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all"
          >
            Explore Work
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-sm text-gray-500">
        EmpowerWork © {new Date().getFullYear()} | Connecting jobs and tools seamlessly.
      </footer>
    </div>
  );
};

export default MachineMainPage;
