import React, { useState } from 'react';
import './Projects.css';
import ProjectModal from './ProjectModal';

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const mechanicalProjects = [
    {
      id: 1,
      title: 'Robotic Arm System',
      description: 'Designed and built a 6-DOF robotic arm with precision control systems and inverse kinematics algorithms.',
      tags: ['CAD', 'SolidWorks', 'Control Systems', 'Mechatronics'],
      extendedDescription: 'This project involved designing a fully functional 6-degree-of-freedom robotic arm from conception to implementation. The challenge was achieving sub-millimeter precision while maintaining real-time response times. I developed custom inverse kinematics algorithms to enable intuitive end-effector control and implemented PID feedback loops for each joint. The arm successfully performs complex assembly tasks with a repeatability of ±0.5mm, demonstrating practical applications in industrial automation and precision manufacturing.',
      features: [
        'Real-time inverse kinematics with null-space manipulation',
        'Multi-joint PID control with adaptive feedback',
        'Collision detection and avoidance algorithms',
        'Vision-guided end-effector positioning'
      ]
    },
    {
      id: 2,
      title: 'Thermal Management System',
      description: 'Developed an advanced cooling system for high-performance applications using computational fluid dynamics.',
      tags: ['CFD', 'ANSYS', 'Heat Transfer', 'Optimization'],
      extendedDescription: 'This thermal management project focused on designing an efficient cooling solution for a high-performance computing environment. Using computational fluid dynamics simulations, I optimized the heat exchanger design to achieve a 40% reduction in thermal resistance compared to baseline systems. The solution involved iterative prototyping, temperature mapping, and flow visualization to identify hotspots and optimize coolant distribution patterns.',
      features: [
        'CFD simulation and optimization of coolant flow paths',
        'Thermal stress analysis across material interfaces',
        'Pump and fan selection for optimal efficiency',
        'Prototype validation with thermal imaging'
      ]
    },
    {
      id: 3,
      title: 'Composite Material Analysis',
      description: 'Research on carbon fiber composites with finite element analysis for structural optimization.',
      tags: ['FEA', 'ABAQUS', 'Materials', 'Simulation'],
      extendedDescription: 'This research project explored the behavior of carbon fiber reinforced polymers under combined loading conditions. Using finite element analysis, I characterized the material properties and predicted failure modes for different fiber orientations and stacking sequences. The work resulted in optimized composite structures that achieved 35% weight reduction while maintaining structural integrity, with applications in aerospace and automotive industries.',
      features: [
        'Fiber orientation optimization for multi-axial loading',
        'Progressive failure analysis and damage prediction',
        'Fatigue life estimation under cyclic loading',
        'Manufacturing process simulation for defect prediction'
      ]
    }
  ];

  const softwareProjects = [
    {
      id: 1,
      title: 'Boolean News',
      description: 'Built an AI system that classifies news articles as real or fake with confidence and bias analysis.',
      tags: ['React', 'Python', 'TensorFlow', 'WebSockets', 'D3.js'],
      extendedDescription: 'Boolean News is an AI-powered web app built with Flask that analyzes news articles to determine whether they are likely real or fake. It uses an XGBoost model trained on a Kaggle fake-news/real-news dataset and applies TF-IDF text vectorization for classification. The app also provides a confidence score and basic sentiment and subjectivity analysis to help users assess potential bias.',
      features: [
        'NLP-based fake news classification with 94% accuracy',
        'Real-time bias detection across multiple dimensions',
        'Interactive network visualization of article spread patterns',
        'Multi-source credibility scoring algorithm'
      ]
    },
    {
      id: 2,
      title: 'Machine Learning Pipeline',
      description: 'Developed an end-to-end ML pipeline for predictive maintenance using sensor data analysis.',
      tags: ['Python', 'TensorFlow', 'Pandas', 'Data Science', 'MLOps'],
      extendedDescription: 'This project implements a production-grade machine learning pipeline for predictive maintenance in industrial equipment. The system processes sensor streams in real-time, detects anomalies, and predicts component failures 2-4 weeks in advance. I designed the data ingestion layer, feature engineering pipeline, and model serving infrastructure. The deployment achieved 30% reduction in unplanned downtime through early intervention.',
      features: [
        'Streaming data processing with Apache Kafka integration',
        'Automated feature engineering from 200+ sensor inputs',
        'LSTM-based time series anomaly detection',
        'Model retraining pipeline with performance monitoring'
      ]
    },
    {
      id: 3,
      title: 'IoT Control System',
      description: 'Created a distributed IoT platform for remote monitoring and control of mechanical systems.',
      tags: ['Node.js', 'MQTT', 'MongoDB', 'Embedded Systems', 'Docker'],
      extendedDescription: 'This IoT platform enables remote monitoring and control of distributed mechanical systems through a scalable microservices architecture. The system handles real-time data from hundreds of devices, provides secure remote access, and enables automated control workflows. Built with Node.js for the backend and MQTT for device communication, the platform achieves sub-500ms latency for control commands and provides comprehensive audit logging for all operations.',
      features: [
        'MQTT broker with device authentication and encryption',
        'Distributed microservices architecture with Docker containerization',
        'Real-time WebSocket dashboard for system monitoring',
        'Automated control workflows with conditional triggers'
      ]
    }
  ];

  return (
    <>
      <section id="mechanical" className="projects-section">
        <div className="projects-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-number">01</span>
              <span className="title-text">Mechanical Engineering</span>
            </h2>
            <div className="title-line"></div>
          </div>
          <div className="projects-grid">
            {mechanicalProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                hoveredProject={hoveredProject}
                setHoveredProject={setHoveredProject}
                onClick={() => {
                  setSelectedProject(project);
                  setSelectedCategory('Mechanical Engineering');
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="software" className="projects-section">
        <div className="projects-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-number">02</span>
              <span className="title-text">Software/Mechatronics Projects</span>
            </h2>
            <div className="title-line"></div>
          </div>
          <div className="projects-grid">
            {softwareProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                hoveredProject={hoveredProject}
                setHoveredProject={setHoveredProject}
                onClick={() => {
                  setSelectedProject(project);
                  setSelectedCategory('Software Development');
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        category={selectedCategory}
      />
    </>
  );
};

const ProjectCard = ({ project, index, hoveredProject, setHoveredProject, onClick }) => {
  const isHovered = hoveredProject === project.id;

  return (
    <div
      className={`project-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
      onClick={onClick}
      style={{ '--delay': `${index * 0.1}s` }}
    >
      <div className="project-number">0{index + 1}</div>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="project-tags">
        {project.tags.map((tag, tagIndex) => (
          <span key={tagIndex} className="project-tag">{tag}</span>
        ))}
      </div>
      <div className="project-hover-effect"></div>
    </div>
  );
};

export default Projects;


