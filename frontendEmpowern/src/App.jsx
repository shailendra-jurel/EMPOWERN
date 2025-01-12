//  , Navigate, Link
import { BrowserRouter as Router, Route, Routes , Navigate} from 'react-router-dom';
// import { AppProvider } from './context/GlobalContext';
import { Provider } from 'react-redux';
import {store} from './store/store'
import './App.css';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import HomePage from './components/HomePage';

//Labor Work Flow
import MainPage from './components/WorkerFlow/MainPage';
import AppliedPage from './components/WorkerFlow/AppliedPage';
import WorkSelectionPage from './components/WorkerFlow/WorkSelectionPage';
import WorkInformation from './components/WorkerFlow/WorkInformation';
import AdditionalInfo from './components/WorkerFlow/AdditionalInfo';
// import OngoingPage from './components/WorkerFlow/OngoingPage';
import ApplyPage from  './components/WorkerFlow/ApplyingPage'
// import WorkStatusPage from './components/WorkerFlow/WorkStatusPage';

//  Contractor  Work Flow
import EmployeeDetails from './components/ContractorFlow/EmployeeDetails'
import ProjectApplications  from './components/ContractorFlow/ProjectDetails'
import ProjectDetails  from './components/ContractorFlow/ProjectDetails'
import ProjectList  from './components/ContractorFlow/ProjectList'
// import AddProjectStep from './components/ContractorFlow/AddProjectStep'
import  AddProjectStep2  from './components/ContractorFlow/AddProjectStep2'
import AddProjectStep3  from './components/ContractorFlow/AddProjectStep3'
import ContractorMainPage from './components/ContractorFlow/ContractorMainPage'
import ContractPage from './components/ContractPage';

// Machine  Flow    i haven't created yet  but will made it soon
import MachineMainPage from './components/MachineFlow/MachineMainPage';



function App(){
  return (

    // <div>
    //   <h1>Hi I am building Empowern</h1>
    // </div>
    <Provider  store = {store}>
      <Router>
        <Routes>
         {/* Worker Flow Routes */}
          <Route  path='/login'  element = {<LoginPage />}    />
          <Route  path='/signup'  element = {<SignupPage />}    />
          <Route path="/" element={<HomePage />} />

         <Route path="/labor">
            <Route path="main-page" element={<MainPage />} />
            <Route path="applied" element={<AppliedPage />} />
            <Route path="work-selection" element={<WorkSelectionPage />} />
            <Route path="work-information" element={<WorkInformation />} />
            <Route path="additional-info" element={<AdditionalInfo />} />
            <Route path="apply-page" element={<ApplyPage />} />
            <Route path="contract-page" element={<ContractPage />} />
            {/* <Route path="work-status" element={<WorkStatusPage />} /> */}
          </Route>

          {/* Contractor Flow Routes */}
          <Route path="/contractor">
            <Route path="main-page" element={<ContractorMainPage />} />
            {/* <Route path="add-project" element={<AddProjectStep />} /> */}
            <Route path="add-project-step2" element={<AddProjectStep2 />} />
            <Route path="add-project-step3" element={<AddProjectStep3 />} />
            <Route path="employee-details" element={<EmployeeDetails />} />
            <Route path="project-applications" element={<ProjectApplications />} />
            <Route path="project-details" element={<ProjectDetails />} />
           <Route path="project-list" element={<ProjectList />} />  
          </Route>

          {/* <Route path="/" element={<Navigate to="/labor/main-page" />} /> */}

          {/* Machine Flow Routes */}
          <Route path="/machine">
            <Route path="main-page" element={<MachineMainPage />} />
          </Route>

        </Routes>
      </Router>
    </Provider>
  
  )
}
export default App

