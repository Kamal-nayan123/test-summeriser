import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './landingpage.css'; 

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <h1>Welcome to Text Summarizer</h1>
          <p>
            Revolutionize your reading experience with our powerful text summarizer!
            Quickly extract the essential information from any article or document,
            saving you valuable time.
          </p>
        </div>
      </header>

      <main className="main">
        <section className="section features">
          <div className="container">
            <h2>Key Features</h2>
            <ul>
              <li>
                <i className="fas fa-rocket"></i>
                <strong>Fast and Accurate Summarization:</strong> Our algorithm efficiently
                generates concise summaries while preserving the key points.
              </li>
              <li>
                <i className="fas fa-language"></i>
                <strong>Multi-Language Support:</strong> Summarize text in multiple languages,
                making it accessible to a wider audience.
              </li>
              <li>
                <i className="fas fa-mobile-alt"></i>
                <strong>Responsive Design:</strong> Our summarizer works seamlessly on any
                device, from desktops to mobile phones.
              </li>
            </ul>
          </div>
        </section>

        <section className="section screenshots">
          <div className="container">
            <h2>Screenshots</h2>
            {/* Include screenshots or a video demo of your summarizer in action */}
          </div>
        </section>

        <section className="section get-started">
          <div className="container">
            <h2>Get Started</h2>
            <button className="button" onClick={handleLoginClick}>
              Login
            </button>
            <Link to="/home" className="button">
              Home
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2023 Your Company Name</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;