import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const statRefs = useRef([]);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const animateCounter = (element, target) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        if (element) {
          element.textContent = Math.floor(current);
        }
      }, 30);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const observedStats = statRefs.current.filter(Boolean);

    observedStats.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observedStats.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [isVisible]);

  return (
    <section id="about" className="hero">
      <div className="hero-container">
        <div 
          className={`hero-content ${isVisible ? 'visible' : ''}`}
          style={{
            '--mouse-x': `${mousePosition.x}%`,
            '--mouse-y': `${mousePosition.y}%`
          }}
        >
          <div className="hero-content-wrapper">
            <div className="hero-image-container">
              <img 
                src="/profile-image.jpg" 
                alt="Mohammed Zayed" 
                className="hero-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hero-image-placeholder">
                <span>Your Image</span>
              </div>
            </div>
            <div className="hero-text">
              <h1 className="hero-name">
                <span className="name-word">Mohammed</span>{' '}
                <span className="name-word">Zayed</span>
              </h1>
              <p className="hero-university fade-in-delay">Queens University</p>
              <p className="hero-description">
                Mechanical engineer with a passion for software development.
                Building innovative solutions at the intersection of hardware and code.
              </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div 
                  className="stat-number" 
                  data-target="50"
                  ref={(el) => (statRefs.current[0] = el)}
                >0</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat-item">
                <div 
                  className="stat-number" 
                  data-target="5"
                  ref={(el) => (statRefs.current[1] = el)}
                >0</div>
                <div className="stat-label">Years</div>
              </div>
              <div className="stat-item">
                <div 
                  className="stat-number" 
                  data-target="100"
                  ref={(el) => (statRefs.current[2] = el)}
                >0</div>
                <div className="stat-label">Ideas</div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
