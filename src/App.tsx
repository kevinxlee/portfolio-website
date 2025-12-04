import './App.css'
import { useState, useEffect } from 'react';
import PortfolioNavbar from './components/navbar/PortfolioNavbar';
import HomePage from './components/home/HomePage';
import AboutPage from './components/about/AboutPage';
import ResumePage from './components/resume/ResumePage';
import { FaMoon, FaSun } from 'react-icons/fa';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    document.body.className = darkMode ? 'bg-dark text-white' : '';
  }, [darkMode]);

  // Scroll to section based on URL hash on load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  // Update URL and active section based on scroll position
  useEffect(() => {
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const sections = ['home', 'about', 'resume'];
      const scrollPosition = scrollContainer.scrollTop + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (window.location.hash !== `#${sectionId}`) {
              window.history.replaceState(null, '', `#${sectionId}`);
              setActiveSection(sectionId);
            }
            break;
          }
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="header-row">
        <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <PortfolioNavbar darkMode={darkMode} activeSection={activeSection} />
      </div>
      
      <div className="scroll-container">
        <section id="home" className="scroll-section">
          <HomePage darkMode={darkMode} />
        </section>

        <section id="about" className="scroll-section">
          <AboutPage/>
        </section>
        
        <section id="resume" className="scroll-section">
          <ResumePage darkMode={darkMode} />
        </section>
      </div>
    </>
  );
}

export default App