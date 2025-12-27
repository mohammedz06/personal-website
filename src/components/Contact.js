import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const links = [
    { id: 'resume', label: 'Resume', url: 'https://drive.google.com/file/d/1wVrCPx-yJwUIhCMYA4vZb-UiRX43VJUM/view?usp=sharing', icon: '→' },
    { id: 'github', label: 'GitHub', url: 'https://github.com/mohammedz06', icon: '→' },
    { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/0mohammed-zayed6/', icon: '→' },
    { id: 'x', label: 'X', url: 'https://x.com', icon: '→' },
    { id: 'email', label: 'Email', url: 'mailto:23nv59@queensu.ca', icon: '→' }
  ];

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title">
            <span className="title-number">03</span>
            <span className="title-text">Get In Touch</span>
          </h2>
          <p className="contact-subtitle">
            Let's connect and discuss engineering solutions
          </p>
        </div>

        <div className="contact-links">
          {links.map((link, index) => (
            <a
              key={link.id}
              href={link.url}
              target={link.id === 'email' ? '_self' : '_blank'}
              rel={link.id === 'email' ? '' : 'noopener noreferrer'}
              className={`contact-link ${hoveredLink === link.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredLink(link.id)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="link-content">
                <span className="link-label">{link.label}</span>
                <div className="link-arrow">→</div>
              </div>
              <div className="link-border"></div>
            </a>
          ))}
        </div>

        <div className="contact-footer">
          <p className="footer-text">
            Built with intention • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;

