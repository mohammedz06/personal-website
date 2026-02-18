import React, { useState, useRef, useEffect, useMemo } from 'react';
import './ProjectModal.css';

const DEFAULT_RATIO = 16 / 9;

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

const buildRowPartitions = (count, maxRows) => {
  const partitions = [];

  const dfs = (remaining, rowsLeft, current) => {
    if (rowsLeft === 1) {
      partitions.push([...current, remaining]);
      return;
    }

    for (let size = 1; size <= remaining - (rowsLeft - 1); size += 1) {
      dfs(remaining - size, rowsLeft - 1, [...current, size]);
    }
  };

  for (let rows = 1; rows <= Math.min(maxRows, count); rows += 1) {
    dfs(count, rows, []);
  }

  return partitions;
};

const computeGalleryRows = (images, width) => {
  if (!images.length) return [];

  const safeWidth = Math.max(width || 700, 280);
  const gap = safeWidth < 520 ? 10 : 12;

  if (images.length === 4) {
    const totalTarget = safeWidth < 520 ? 300 : 340;
    const baseHeight = (totalTarget - gap * 3) / 4;
    const minHeight = baseHeight * 0.72;
    const maxHeight = baseHeight * 1.32;

    return images.map((item) => ({
      height: clamp(safeWidth / item.ratio, minHeight, maxHeight),
      items: [item]
    }));
  }

  const minHeight = safeWidth < 520 ? 92 : 115;
  const maxHeight = safeWidth < 520 ? 170 : 230;
  const targetHeight = safeWidth < 520 ? 120 : 165;
  const maxRows = safeWidth < 520 ? Math.min(3, images.length) : Math.min(2, images.length);
  const partitions = buildRowPartitions(images.length, maxRows);

  let best = null;

  partitions.forEach((partition) => {
    let pointer = 0;
    let totalHeight = 0;
    let penalty = 0;

    const rows = partition.map((size, rowIndex) => {
      const rowItems = images.slice(pointer, pointer + size);
      pointer += size;

      const ratioSum = rowItems.reduce((sum, item) => sum + item.ratio, 0);
      const rowWidth = safeWidth - gap * (size - 1);
      const rowHeight = rowWidth / ratioSum;

      totalHeight += rowHeight;
      penalty += Math.abs(targetHeight - rowHeight) * 0.3;

      if (rowHeight < minHeight) penalty += (minHeight - rowHeight) * 8;
      if (rowHeight > maxHeight) penalty += (rowHeight - maxHeight) * 2.5;
      if (rowIndex === partition.length - 1 && rowHeight > targetHeight * 1.5) {
        penalty += (rowHeight - targetHeight * 1.5) * 1.5;
      }

      return {
        height: clamp(rowHeight, 70, maxHeight + 30),
        items: rowItems
      };
    });

    penalty += (partition.length - 1) * 6;
    const score = totalHeight + penalty;

    if (!best || score < best.score) {
      best = { score, rows };
    }
  });

  return best ? best.rows : [{ height: targetHeight, items: images }];
};

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
  const [imageRatios, setImageRatios] = useState({});
  const [expandedImage, setExpandedImage] = useState(null);
  const [galleryWidth, setGalleryWidth] = useState(0);
  const modalRef = useRef(null);
  const galleryRef = useRef(null);

  const modalImages = useMemo(() => (
    (project?.galleryImages && project.galleryImages.length > 0
      ? project.galleryImages
      : [project?.image]
    )
      .filter(Boolean)
      .slice(0, 4)
  ), [project]);

  const galleryRows = useMemo(() => {
    const images = modalImages.map((src, index) => ({
      src,
      index,
      ratio: clamp(imageRatios[src] || DEFAULT_RATIO, 0.55, 2.8)
    }));

    return computeGalleryRows(images, galleryWidth);
  }, [modalImages, imageRatios, galleryWidth]);

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
      setImageRatios({});
      setExpandedImage(null);
    }
  }, [isOpen, project]);

  useEffect(() => {
    if (!isOpen || !galleryRef.current) return undefined;

    const node = galleryRef.current;
    const updateWidth = () => setGalleryWidth(node.clientWidth);
    updateWidth();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(node);

    return () => observer.disconnect();
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

  const toggleExpandedImage = (src, index) => {
    setExpandedImage((prev) => {
      if (prev && prev.src === src) return null;
      return { src, index };
    });
  };

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
            <div className="modal-image-rows" ref={galleryRef}>
              {galleryRows.length > 0 ? (
                galleryRows.map((row, rowIndex) => (
                  <div
                    key={`${project.id}-row-${rowIndex}`}
                    className="modal-image-row"
                    style={{ height: `${Math.round(row.height)}px` }}
                  >
                    {row.items.map((item) => (
                      <div
                        key={`${project.id}-${item.src}-${item.index}`}
                        className={`modal-image-item ${failedImages[item.src] ? 'is-fallback' : ''} ${expandedImage && expandedImage.src === item.src ? 'is-active' : ''}`}
                        style={{ '--item-grow': item.ratio }}
                        onClick={() => {
                          if (!failedImages[item.src]) {
                            toggleExpandedImage(item.src, item.index);
                          }
                        }}
                        role={failedImages[item.src] ? undefined : 'button'}
                        tabIndex={failedImages[item.src] ? undefined : 0}
                        onKeyDown={(e) => {
                          if (failedImages[item.src]) return;
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleExpandedImage(item.src, item.index);
                          }
                        }}
                      >
                        {failedImages[item.src] ? (
                          <div className="modal-image-fallback">
                            <span>{project.title}</span>
                          </div>
                        ) : (
                          <img
                            src={item.src}
                            alt={`${project.title} screenshot ${item.index + 1}`}
                            className="modal-image"
                            loading="lazy"
                            onLoad={(e) => {
                              const naturalWidth = e.currentTarget.naturalWidth;
                              const naturalHeight = e.currentTarget.naturalHeight;
                              if (!naturalWidth || !naturalHeight) return;

                              const ratio = naturalWidth / naturalHeight;
                              setImageRatios((prev) => {
                                const existing = prev[item.src];
                                if (existing && Math.abs(existing - ratio) < 0.01) return prev;
                                return { ...prev, [item.src]: ratio };
                              });
                            }}
                            onError={() => {
                              setFailedImages((prev) => ({ ...prev, [item.src]: true }));
                              setExpandedImage((prev) => (prev && prev.src === item.src ? null : prev));
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="modal-image-row" style={{ height: '140px' }}>
                  <div className="modal-image-item" style={{ flexGrow: 1, flexBasis: 0 }}>
                    <div className="modal-image-fallback">
                      <span>No image available</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {expandedImage && (
              <div
                className="modal-image-lightbox"
                onClick={() => setExpandedImage(null)}
                role="button"
                tabIndex={0}
                aria-label="Minimize expanded image"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                    e.preventDefault();
                    setExpandedImage(null);
                  }
                }}
              >
                <img
                  src={expandedImage.src}
                  alt={`${project.title} expanded screenshot ${expandedImage.index + 1}`}
                  className="modal-image-lightbox-img"
                />
                <span className="modal-image-lightbox-hint">Click again to minimize</span>
              </div>
            )}
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
