import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/loginpage';
import LandingPage from './components/landingpage';
import RegisterPage from './components/registerpage';
import YourMainApp from './components/YourMainApp'; // Your main application component
import Chat from './components/chat';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/app" element={<LandingPage />} /> 
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/register" element={<RegisterPage />} /> 
        <Route path="/" element={<YourMainApp />} /> 
        <Route path="/Chat" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;