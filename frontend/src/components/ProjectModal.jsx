import React, { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle2, Layers, Cpu } from 'lucide-react';
import styles from './ProjectModal.module.css';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const techs = Array.isArray(project.technologies)
    ? project.technologies
    : typeof project.technologies === 'string'
    ? JSON.parse(project.technologies || '[]')
    : [];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} glass-panel`} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalCategoryBadge}>{project.category} stack</div>
          <h2 className={styles.modalTitle}>{project.title}</h2>
          <p className={styles.modalShortDesc}>{project.description}</p>
        </div>

        {/* Modal Image */}
        <div className={styles.modalImageWrapper}>
          <img
            src={project.image_url}
            alt={project.title}
            className={styles.modalImg}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          <div className={styles.modalSection}>
            <h4 className={styles.modalSectionTitle}>
              <Layers size={18} className={styles.textCyan} />
              <span>Full Project Breakdown &amp; Architecture</span>
            </h4>
            <p className={styles.modalLongDesc}>
              {project.long_description || project.description}
            </p>
          </div>

          {/* Tech Stack List */}
          <div className={styles.modalSection}>
            <h4 className={styles.modalSectionTitle}>
              <Cpu size={18} className={styles.textCyan} />
              <span>Technologies &amp; Integrations</span>
            </h4>
            <div className={styles.modalTechChips}>
              {techs.map((t, idx) => (
                <span key={idx} className={styles.techChip}>
                  <CheckCircle2 size={13} className={styles.textEmerald} />
                  <span>{t}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className={styles.modalActions}>
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <ExternalLink size={17} />
                <span>Open Live Vercel Application</span>
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <Github size={17} />
                <span>View Source Repository</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
