import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import BackgroundGrid from './components/BackgroundGrid';
import { initScrollAnimations } from './utils/scrollAnimation';

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    initScrollAnimations();
  }, []);

  return (
    <div className="App">
      <BackgroundGrid />
      <Navigation scrollY={scrollY} />
      <Hero />
      <Skills />
      <Projects />
      <Contact />
    </div>
  );
}

export default App;

