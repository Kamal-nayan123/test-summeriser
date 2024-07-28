import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './YourMainApp.css';

function App() {
  const [showChat, setShowChat] = useState(false);

  const handleStartGenerating = () => {
    setShowChat(true);
  };

  return (
    <div className="container">
      {!showChat && (
        <>
          <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bell">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
          </div>

          <div className="content">
            <h2>Welcome to your Dashboard</h2>
            <p>This is where you can manage all your tasks, projects, and data. Get started generating by clicking the button below.</p>
            <button className="button" onClick={handleStartGenerating}>
              Start Generating
            </button>
          </div>
        </>
      )}

      {showChat && (
        <Link to="/chat" className="button">
          Go to Chat Interface
        </Link>
      )}
    </div>
  );
}

export default App;