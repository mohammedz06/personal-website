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
      image: '/projects/robotic-arm.jpg',
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
      image: '/projects/thermal-management.jpg',
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
      image: '/projects/composite-analysis.jpg',
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
      id: 4,
      title: '[🎉HACKATHON WINNER] Golden Grants',
      image: '/projects/GoldenGrants/GoldenGrants.png',
      galleryImages: [
        '/projects/GoldenGrants/Image1.jpg',
        '/projects/GoldenGrants/Image2.png',
        '/projects/GoldenGrants/Image3.png',
        '/projects/GoldenGrants/Image4.png'
      ],
      description: 'Golden Grants is a Snowflake-powered Chrome extension that helps nonprofits instantly check grant eligibility and generate high-quality application drafts from any grant page.',
      githubUrl: 'https://github.com/mohammedz06/GoldenGrants',
      devpostUrl: 'https://devpost.com/software/golden-grants',
      tags: ['Express.js', 'Node.js', 'PostgreSQL', 'React', 'Snowflake', 'TypeScript'],
      extendedDescription: 'Golden Grants is a Manifest V3 Chrome extension built with TypeScript and a React side panel, backed by a Node.js + Express API using shared Zod schemas for strict validation and deterministic outputs. Snowflake SQL API and Cortex provide the core language reasoning, eligibility evaluation, and structured extraction, while the backend handles chunking, caching, guardrails, and confidence calibration. Security is enforced through server-side inference, Google OAuth gating, and per-user data isolation, ensuring credentials never reach the client. The system is designed for reliable, machine-readable grant analysis rather than simple text summarization.',
      features: [
        'Real-time eligibility analysis on live grants',
        'Structured extraction of deadlines and requirements',
        'Explainable verdicts with confidence and constraints',
        'Secure backend inference with user isolation'
      ]
    },
    {
      id: 5,
      title: 'RythmWear',
      image: '/projects/RythmWear/RythmWear.png',
      galleryImages: [
        '/projects/RythmWear/Image1.jpg',
        '/projects/RythmWear/Image2.jpg',
        '/projects/RythmWear/Image3.jpg'
      ],
      description: 'RhythmWear is a wearable music interface that turns hand movements into sound. Using flex sensors and motion data, the glove lets you play notes, control effects, and shape audio in real time.',
      githubUrl: 'https://github.com/mohammedz06/RythmWear',
      devpostUrl: 'https://devpost.com/software/rythmwear',
      tags: ['C++', 'express.js', 'mongodb', 'node.js', 'react', 'typescript', 'vite', 'websocket'],
      extendedDescription: 'RhythmWear is a wearable, real-time gesture-to-audio system built around an ESP32 that performs continuous sensor acquisition from flex sensors and motion sensing, with onboard filtering to reduce noise before transmission. Sensor data is streamed wirelessly via WebSockets to a Node.js + Express server (hosted on a Raspberry Pi), which manages low-latency messaging, connection handling, and state synchronization. A React + TypeScript frontend provides calibration, telemetry visualization, and control logic, while the Web Audio API drives browser-based, low-latency sound synthesis and playback. The communication layer uses a lightweight protocol optimized for minimal payload size and deterministic state updates, enabling stable gesture-triggered audio despite sensor jitter and network variability. System behavior relies heavily on smoothing, hysteresis, and state management rather than raw sensor values, reflecting a latency-sensitive, event-driven architecture.',
      features: [
        'Real-time gesture-controlled audio performance interface',
        'Wireless low-latency sensor streaming via WebSockets',
        'Adaptive calibration and signal stability mechanisms',
        'Browser-based sound engine using Web Audio API'
      ]
    },
    {
      id: 6,
      title: 'IoT Control System',
      image: '/projects/iot-control.jpg',
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
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div
      className={`project-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
      onClick={onClick}
      style={{ '--delay': `${index * 0.1}s` }}
    >
      <div className="project-media">
        {project.image && !hasImageError ? (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="project-image"
            onError={() => setHasImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="project-media-placeholder">
            <span>{project.title}</span>
          </div>
        )}
      </div>

      <div className="project-content">
        <div className="project-number">0{index + 1}</div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-tags">
          {project.tags.map((tag, tagIndex) => (
            <span key={tagIndex} className="project-tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="project-hover-effect"></div>
    </div>
  );
};

export default Projects;
