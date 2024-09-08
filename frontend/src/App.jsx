import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home.jsx';
import Signup from './components/signup.jsx';
import Login from './components/login.jsx';
import AdminPanel from './components/admin.jsx';
import UserDashboard from './components/dashboard.jsx';
import AboutUs from './components/about.jsx';


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addUser" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminp" element={<AdminPanel />} />
          <Route path="/:id/userdashboard" element={<UserDashboard />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
