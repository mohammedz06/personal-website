import React, { useState } from 'react';
import './Skills.css';

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const skillCategories = [
    {
      category: 'Programming Languages',
      skills: ['Python', 'Java', 'C++', 'JavaScript', 'Lua', 'HTML/CSS']
    },
    {
      category: 'Engineering Software',
      skills: ['SolidWorks', 'AutoCAD', 'MATLAB', 'ANSYS', 'Fusion 360']
    },
    {
      category: 'Web Technologies',
      skills: ['React', 'Node.js', 'Git', 'REST APIs', 'WebSockets']
    }
  ];

  return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-number">00</span>
            <span className="title-text">Skills & Expertise</span>
          </h2>
          <div className="title-line"></div>
        </div>

        <div className="skills-grid">
          {skillCategories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex}
              className="skill-category"
              style={{ '--delay': `${categoryIndex * 0.1}s` }}
            >
              <h3 className="category-title">{category.category}</h3>
              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className={`skill-item ${hoveredSkill === `${categoryIndex}-${skillIndex}` ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredSkill(`${categoryIndex}-${skillIndex}`)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <span className="skill-name">{skill}</span>
                    <div className="skill-underline"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

