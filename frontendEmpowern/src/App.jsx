

import React from 'react'
//  , Navigate, Link
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { AppProvider } from './context/GlobalContext';
import { Provider } from 'react-redux';
import {store} from './store/store'
import './App.css';



//Labor Work Flow
import MainPage from './components/WorkerFlow/MainPage';
import AppliedPage from './components/WorkerFlow/AppliedPage';
import WorkSelectionPage from './components/WorkerFlow/WorkSelectionPage';
import WorkInformation from './components/WorkerFlow/WorkInformation';
import AdditionalInfo from './components/WorkerFlow/AdditionalInfo';
// import OngoingPage from './components/WorkerFlow/OngoingPage';
import ApplyingPage from  './components/WorkerFlow/ApplyingPage'


//  Contractor  Work Flow


import EmployeeDetails from './components/ContractorFlow/EmployeeDetails'
import ProjectApplications  from './components/ContractorFlow/ProjectDetails'
import ProjectDetails  from './components/ContractorFlow/ProjectDetails'
import ProjectList  from './components/ContractorFlow/ProjectList'
import  AddProjectStep2  from './components/ContractorFlow/AddProjectStep2'
import AddProjectStep3  from './components/ContractorFlow/AddProjectStep3'



function App(){
  return (

    // <div>
    //   <h1>Hi I am building Empowern</h1>
    // </div>
    <Provider  store = {store}>
      <Router>


        <Routes>
          
          <Route path="/" element={<MainPage />} />
          <Route path="/applied" element={<AppliedPage />} />
          {/* <Route path="/ongoing" element={<OngoingPage />} /> */}
          <Route path="/labor/work-selection" element={<WorkSelectionPage />} />
          <Route path="/labor/work-information" element={<WorkInformation />} />
          <Route path="/labor/additional-info" element={<AdditionalInfo />} />
          <Route  path = '/labor/apply-page'  element = {<ApplyingPage/>}  />





      {/* Contractor Workflow  */}
          <Route path="/contractor/add-project-step2" element={<AddProjectStep2 />} />
        <Route path="/contractor/add-project-step3" element={<AddProjectStep3 />} />
        <Route path="/contractor/employee-details" element={<EmployeeDetails />} />
        <Route path="/contractor/project-applications" element={<ProjectApplications />} />
        <Route path="/contractor/project-details" element={<ProjectDetails />} />
        <Route path="/contractor/project-list" element={<ProjectList />} />




        </Routes>
      </Router>
    </Provider>
  
  )
}
export default App

