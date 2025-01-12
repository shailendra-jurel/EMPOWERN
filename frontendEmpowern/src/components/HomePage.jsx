import { Link } from 'react-router-dom';
import { MdOutlineEngineering } from 'react-icons/md';
import { FaUserTie, FaTools } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-700 via-blue-800 to-blue-500 shadow-xl z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white">EmpowerWork</h1>
          <nav className="hidden sm:flex space-x-4">
            <Link to="/labor/main-page" className="text-white text-sm hover:underline">Worker Flow</Link>
            <Link to="/contractor/main-page" className="text-white text-sm hover:underline">Contractor Flow</Link>
            <Link to="/machine/main-page" className="text-white text-sm hover:underline">Machine Flow</Link>
          </nav>
          {/* Hamburger Menu for Mobile */}
          <div className="sm:hidden">
            <button className="text-white text-lg focus:outline-none">&#9776;</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 pt-20 pb-16">
        {/* Intro Section */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-blue-800 mb-4">Welcome to EmpowerWork!</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-md sm:max-w-2xl mx-auto">
            Bridging the gap between workers, contractors, and machine rentees with seamless workflows and unmatched efficiency.
          </p>
        </div>

        {/* Workflow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Worker Flow */}
          <Link
            to="/labor/main-page"
            className="group flex flex-col items-center bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <MdOutlineEngineering className="text-blue-600 text-6xl mb-3 group-hover:text-blue-800" />
            <h3 className="text-base sm:text-lg font-semibold text-blue-800 group-hover:text-blue-900">Search for Work</h3>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Discover job opportunities, apply easily, and manage your tasks efficiently.
            </p>
          </Link>

          {/* Contractor Flow */}
          <Link
            to="/contractor/main-page"
            className="group flex flex-col items-center bg-gradient-to-r from-teal-100 via-teal-50 to-teal-100 p-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <FaUserTie className="text-teal-600 text-6xl mb-3 group-hover:text-teal-700" />
            <h3 className="text-base sm:text-lg font-semibold text-teal-800 group-hover:text-teal-900">Hire Workers</h3>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Post job opportunities and find skilled workers for your needs.
            </p>
          </Link>

          {/* Machine Rentee Flow */}
          <Link
            to="/machine/main-page"
            className="group flex flex-col items-center bg-gradient-to-r from-indigo-100 via-indigo-50 to-indigo-100 p-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <FaTools className="text-indigo-600 text-6xl mb-3 group-hover:text-indigo-700" />
            <h3 className="text-base sm:text-lg font-semibold text-indigo-800 group-hover:text-indigo-900">Rent or Borrow Machines</h3>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Access tools and machines to simplify your projects.
            </p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-blue-900 text-gray-300 py-3">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm">
            EmpowerWork © {new Date().getFullYear()} | Connecting jobs and tools seamlessly.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/privacy-policy" className="text-xs hover:underline">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-xs hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
