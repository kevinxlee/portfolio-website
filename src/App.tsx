import './App.css'
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MyNavbar from './components/PortfolioNavbar';
import HomePage from './components/home/HomePage';
import BrandName from './components/brandname/BrandName';
import ResumePage from './components/resume/ResumePage'; /* Imported ResumePage */
import { FaMoon, FaSun, FaLinkedin } from 'react-icons/fa'; /* Added FaLinkedin */

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'bg-dark text-white' : '';
  }, [darkMode]);

  return (
    <>
      <div className="header-row">
        {/* Group brand name and dark mode toggle together */}
        <div className="brand-toggle-group">
          <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <img
            src="https://media.licdn.com/dms/image/v2/C4E03AQF5Rm5ONbgHFQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1602294599941?e=1765411200&v=beta&t=2V4q9GXpzSh5iTLYDpr0cyvOa-b8HbJe7lPeq6xvn1s"
            alt="Kevin Lee"
            className="profile-photo"
            onError={(e) => {
              e.currentTarget.style.display = 'none'; /* Hides image if it fails to load */
            }}
          />
          <BrandName />
          <a
            href="https://www.linkedin.com/in/kevin-lee-x/"
            target="_blank" /* Opens link in new tab */
            rel="noopener noreferrer" /* Security best practice for external links */
            className="social-link"
          >
            <FaLinkedin />
          </a>
        </div>
        <MyNavbar darkMode={darkMode} />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resume" element={<ResumePage darkMode={darkMode} />} /> {/* Add this route */}
        {/* other routes */}
      </Routes>
    </>
  );
}

export default App