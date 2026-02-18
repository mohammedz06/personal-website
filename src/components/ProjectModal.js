import React, { useState, useRef, useEffect } from 'react';
import './ProjectModal.css';

const ProjectModal = ({ project, isOpen, onClose, category }) => {
  const [position, setPosition] = useState(() => {
    // Initialize to center position
    const modalWidth = 900;
    const modalHeight = window.innerHeight * 0.85;
    return {
      x: (window.innerWidth - Math.min(modalWidth, window.innerWidth * 0.9)) / 2,
      y: (window.innerHeight - modalHeight) / 2
    };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [failedImages, setFailedImages] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Recalculate center position when modal opens (in case window was resized)
      const modalWidth = 900;
      const modalHeight = window.innerHeight * 0.85;
      const x = (window.innerWidth - Math.min(modalWidth, window.innerWidth * 0.9)) / 2;
      const y = (window.innerHeight - modalHeight) / 2;
      setPosition({ x: Math.max(0, x), y: Math.max(0, y) });
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFailedImages({});
    }
  }, [isOpen, project]);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => {
        if (!modalRef.current) return;
        
        const modal = modalRef.current;
        const modalWidth = modal.offsetWidth;
        const modalHeight = modal.offsetHeight;
        
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        
        // Constrain to viewport
        newX = Math.max(0, Math.min(newX, window.innerWidth - modalWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - modalHeight));
        
        setPosition({ x: newX, y: newY });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  if (!isOpen || !project) return null;

  const modalImages = (project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [project.image]
  )
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="project-modal"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-header"
          onMouseDown={handleMouseDown}
        >
          <div className="modal-title-bar">
            <span className="modal-category">{category}</span>
            <span className="modal-title">{project.title}</span>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <span></span>
            <span></span>
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-image-section">
            <div className={`modal-image-grid count-${Math.max(modalImages.length, 1)}`}>
              {modalImages.length > 0 ? (
                modalImages.map((src, index) => (
                  <div key={`${project.id}-${src}-${index}`} className={`modal-image-item slot-${index + 1}`}>
                    {failedImages[src] ? (
                      <div className="modal-image-fallback">
                        <span>{project.title}</span>
                      </div>
                    ) : (
                      <img
                        src={src}
                        alt={`${project.title} screenshot ${index + 1}`}
                        className="modal-image"
                        loading="lazy"
                        onError={() => setFailedImages((prev) => ({ ...prev, [src]: true }))}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="modal-image-item slot-1">
                  <div className="modal-image-fallback">
                    <span>No image available</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-text-section">
            <h3 className="modal-section-title">Overview</h3>
            <p className="modal-description">
              {project.description}
            </p>
            <p className="modal-extended-description">
              {project.extendedDescription || 'Comprehensive project details and implementation information.'}
            </p>

            <h3 className="modal-section-title">Technologies & Tools</h3>
            <div className="modal-tags">
              {project.tags.map((tag, index) => (
                <span key={index} className="modal-tag">{tag}</span>
              ))}
            </div>

            <h3 className="modal-section-title">Key Features</h3>
            <ul className="modal-features">
              {project.features && project.features.length > 0 ? (
                project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))
              ) : (
                <li>No features listed</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
