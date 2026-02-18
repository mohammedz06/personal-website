import React, { useState, useRef, useEffect, useMemo } from 'react';
import './ProjectModal.css';

const DEFAULT_RATIO = 16 / 9;

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

const getOrientation = (ratio) => {
  if (ratio > 1.08) return 'landscape';
  if (ratio < 0.92) return 'portrait';
  return 'square';
};

const getFourImageLayoutOrder = (images) => {
  if (images.length !== 4) return images;

  const permutations = [];
  const buildPermutations = (remaining, current) => {
    if (!remaining.length) {
      permutations.push(current);
      return;
    }

    for (let i = 0; i < remaining.length; i += 1) {
      const next = remaining[i];
      const nextRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
      buildPermutations(nextRemaining, [...current, next]);
    }
  };

  buildPermutations(images, []);

  const totalLandscape = images.filter((item) => getOrientation(item.ratio) === 'landscape').length;
  const totalPortrait = images.filter((item) => getOrientation(item.ratio) === 'portrait').length;
  const shouldForceMixedRows = totalLandscape >= 2 && totalPortrait >= 2;

  let bestOrder = images;
  let bestScore = Number.POSITIVE_INFINITY;

  permutations.forEach((order) => {
    const rows = [
      [order[0], order[1]],
      [order[2], order[3]]
    ];

    let score = 0;
    const rowRatioSums = rows.map((row) => row[0].ratio + row[1].ratio);

    // Keep row visual weights close so the two rows feel harmonious.
    score += Math.abs(rowRatioSums[0] - rowRatioSums[1]) * 28;

    rows.forEach((row, rowIndex) => {
      const rowOrientations = row.map((item) => getOrientation(item.ratio));
      const rowHasLandscape = rowOrientations.includes('landscape');
      const rowHasPortrait = rowOrientations.includes('portrait');
      const rowHasSquare = rowOrientations.includes('square');

      if (shouldForceMixedRows) {
        // When we have two portraits + two landscapes, prefer 1 portrait + 1 landscape per row.
        if (!(rowHasLandscape && rowHasPortrait)) {
          score += 120;
        }
      } else if ((totalLandscape > 0 && totalPortrait > 0) && !(rowHasLandscape && rowHasPortrait)) {
        score += 24;
      } else if (rowHasSquare && (rowHasLandscape || rowHasPortrait)) {
        score += 8;
      }

      row.forEach((item, colIndex) => {
        const expectedPosition = rowIndex * 2 + colIndex;
        // Small stability penalty to avoid unnecessary jumping when choices tie.
        score += Math.abs(item.index - expectedPosition) * 0.8;
      });
    });

    if (score < bestScore) {
      bestScore = score;
      bestOrder = order;
    }
  });

  return bestOrder;
};

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

  const orderedImages = images.length === 4 ? getFourImageLayoutOrder(images) : images;
  const safeWidth = Math.max(width || 700, 280);
  const gap = safeWidth < 520 ? 10 : 12;
  const minHeight = safeWidth < 520 ? 90 : 105;
  const maxHeight = safeWidth < 520 ? 155 : 195;
  const targetHeight = safeWidth < 520 ? 120 : 145;

  const partitions = orderedImages.length === 4
    ? [[2, 2]]
    : buildRowPartitions(orderedImages.length, Math.min(2, orderedImages.length));

  let best = null;

  partitions.forEach((partition) => {
    let pointer = 0;
    let totalHeight = 0;
    let penalty = 0;

    const rows = partition.map((size, rowIndex) => {
      const rowItems = orderedImages.slice(pointer, pointer + size);
      pointer += size;

      const ratioSum = rowItems.reduce((sum, item) => sum + item.ratio, 0);
      const fullRowHeight = (safeWidth - gap * (size - 1)) / ratioSum;
      let rowHeight = clamp(fullRowHeight, minHeight, maxHeight);
      let rowWidth = ratioSum * rowHeight + gap * (size - 1);

      // If clamp made row overflow, prefer fitting width over minimum height.
      if (rowWidth > safeWidth) {
        rowHeight = fullRowHeight;
        rowWidth = safeWidth;
      }

      totalHeight += rowHeight;
      penalty += Math.abs(targetHeight - rowHeight) * 0.6;
      penalty += Math.abs(safeWidth - rowWidth) * 0.08;

      return {
        height: clamp(rowHeight, 70, maxHeight + 30),
        width: rowWidth,
        items: rowItems.map((item) => ({
          ...item,
          width: clamp(item.ratio * rowHeight, 64, safeWidth)
        }))
      };
    });

    penalty += (partition.length - 1) * 8;
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
                        style={{
                          width: `${Math.round(item.width)}px`,
                          height: `${Math.round(row.height)}px`
                        }}
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
                  <div className="modal-image-item" style={{ width: '100%', height: '140px' }}>
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
