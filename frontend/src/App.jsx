import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Services from './components/Services';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [backendStatus, setBackendStatus] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Poll backend health status
  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const json = await res.json();
        setBackendStatus(json);
      } else {
        setBackendStatus({ status: 'unreachable', database: { online: false } });
      }
    } catch (err) {
      setBackendStatus({ status: 'offline', database: { online: false } });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // Update active section on scroll
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'services', 'stats', 'contact'];
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop - offset;
          if (scrollY >= top) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        backendStatus={backendStatus}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Viewport Content */}
      <main className="main-content">
        <Hero backendStatus={backendStatus} />
        <About />
        <Skills />
        <Projects />
        <Services />
        <Stats backendStatus={backendStatus} />
        <Contact backendStatus={backendStatus} onMessageSent={checkHealth} />
        <Footer />
      </main>
    </div>
  );
}
