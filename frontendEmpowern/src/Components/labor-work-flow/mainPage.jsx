import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const MainPage = () => {
  const [currentWork, setCurrentWork] = useState([]);
  const [appliedWork, setAppliedWork] = useState([]);
  const [completedWork, setCompletedWork] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setCurrentWork([
      { id: 1, title: 'Ongoing Project 1', date: '2024-07-15' },
      { id: 2, title: 'Ongoing Project 2', date: '2024-07-20' },
      { id: 3, title: 'Ongoing Project 3', date: '2024-07-25' },
      { id: 4, title: 'Ongoing Project 4', date: '2024-07-30' },
    ]);
    setAppliedWork([
      { id: 5, title: 'Applied Project 1', date: '2024-08-01' },
      { id: 6, title: 'Applied Project 2', date: '2024-08-05' },
      { id: 7, title: 'Applied Project 3', date: '2024-08-10' },
      { id: 8, title: 'Applied Project 4', date: '2024-08-15' },
    ]);
    setCompletedWork([
      { id: 9, title: 'Completed Project 1', date: '2024-07-01' },
      { id: 10, title: 'Completed Project 2', date: '2024-07-05' },
      { id: 11, title: 'Completed Project 3', date: '2024-07-10' },
      { id: 12, title: 'Completed Project 4', date: '2024-07-15' },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 font-sans">
      <h1 className="text-2xl font-bold text-red-700 mb-8">Your Works</h1>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10">
        <div className="flex justify-between items-center mb-5">
        <Link to="/ongoing" className="text-red-600 hover:text-red-800 transition-colors text-lg font-medium">
          View Ongoing Projects
        </Link>
          {/* <h2 className="text-3xl font-semibold text-gray-800">Ongoing Projects</h2> */}
          <span className="text-gray-600 text-sm">({currentWork.length})</span>
        </div>
      </div>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10 mt-6">
        <div className="flex justify-between items-center mb-5">
          {/* <h2 className="text-3xl font-semibold text-gray-800">Applied Projects</h2> */}
          <Link to="/applied" className="text-red-600 hover:text-red-800 transition-colors text-lg font-medium">
          View Applied Projects
        </Link>
          <span className="text-gray-600 text-sm">({appliedWork.length})</span>
        </div>
        
      </div>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10 mt-6">
        <div className="flex justify-between items-center mb-5">
        <Link to="/completed" className="text-red-600 hover:text-red-800 transition-colors text-lg font-medium">
          View Completed Projects
        </Link>
          {/* <h2 className="text-3xl font-semibold text-gray-800">Completed Projects</h2> */}
          <span className="text-gray-600 text-sm">({completedWork.length})</span>
        </div>
      </div>
      <div className="mt-8">
        <Link to="/work-selection">
          <Button type="primary" className="w-full max-w-xs bg-red-600 hover:bg-red-700 transition-colors text-lg font-semibold shadow-lg">
            Search for More Work
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
