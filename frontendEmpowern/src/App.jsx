

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
// import OngoingPage from './components/WorkerFlow/OngoingPage';



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
        </Routes>
      </Router>
    </Provider>
  
  )
}
export default App

