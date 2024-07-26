import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/loginpage';
import RegisterPage from './components/registerpage';
import YourMainApp from './YourMainApp'; // Your main application component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/register" element={<RegisterPage />} /> 
        <Route path="/app" element={<YourMainApp />} /> 
      </Routes>
    </Router>
  );
};

export default App;