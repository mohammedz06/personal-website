import React, { useEffect, useState } from 'react';
import './BackgroundGrid.css';

const BackgroundGrid = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="background-grid">
      <div className="dot-grid"></div>
      <div 
        className="grid-line horizontal"
        style={{ '--mouse-y': `${mousePosition.y}%` }}
      />
      <div 
        className="grid-line vertical"
        style={{ '--mouse-x': `${mousePosition.x}%` }}
      />
    </div>
  );
};

export default BackgroundGrid;

