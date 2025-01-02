import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import LoginPage from '../components/LoginPage';
import SignupPage from '../components/SignupPage';
import ContractorMainPage from '../components/ContractorFlow/ContractorMainPage';
import WorkerMainPage from '../components/WorkerFlow/MainPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Contractor Routes */}
      <Route path="/contractor/*">
        <Route path="main-page" element={<ContractorMainPage />} />
        {/* <Route path="dashboard" element={<ContractorMainPage />} /> */}
      </Route>

      {/* Worker Routes */}
      <Route path="/worker/*">
        <Route path="main-page" element={<WorkerMainPage />} />
        {/* <Route path="dashboard" element={<WorkerMainPage />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
