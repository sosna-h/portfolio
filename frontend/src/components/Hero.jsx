import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Code,
  Terminal,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import styles from './Hero.module.css';

const animatedRoles = [
  'React.js & Node.js Full-Stack Developer',
  'MERN Stack Engineer & Architect',
  'Building Netflix, ChatGPT & AI Forum Apps',
  'RESTful API & MySQL Specialist'
];

export default function Hero({ backendStatus }) {
  const [bgChoice, setBgChoice] = useState('sosna');

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = animatedRoles[roleIndex];
    let timer;

    if (!isDeleting && displayText === current) {
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % animatedRoles.length);
    } else {
      const speed = isDeleting ? 30 : 65;
      timer = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? current.substring(0, displayText.length - 1)
            : current.substring(0, displayText.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  const isDbOnline = backendStatus?.database?.online;

  return (
    <section id="hero" className={styles.heroSection}>
      {/* Full-Screen Cross-Fading Backgrounds */}
      <div
        className={`${styles.heroFullscreenBg} ${bgChoice === 'sosna' ? styles.visible : ''}`}
        style={{ backgroundImage: `url('/assets/img/sosna-photo.jpg')` }}
      />
      <div
        className={`${styles.heroFullscreenBg} ${bgChoice === 'workspace' ? styles.visible : ''}`}
        style={{ backgroundImage: `url('/assets/img/hero-developer.jpg')` }}
      />

      {/* Gradient Overlay for Text Clarity */}
      <div className={styles.heroBackdropGradient} />

      {/* Animated Image Switcher (Sosna Portrait / Developer Computer) */}
      <div className={styles.heroImageSwitcher}>
        <button
          type="button"
          className={`${styles.switcherBtn} ${bgChoice === 'sosna' ? styles.active : ''}`}
          onClick={() => setBgChoice('sosna')}
          title="Switch to Sosna Hailu Portrait"
        >
          <ImageIcon size={14} className={styles.switcherIcon} />
          <span>Sosna Portrait</span>
        </button>
        <button
          type="button"
          className={`${styles.switcherBtn} ${bgChoice === 'workspace' ? styles.active : ''}`}
          onClick={() => setBgChoice('workspace')}
          title="Switch to Developer Computer Workspace"
        >
          <Code size={14} className={styles.switcherIcon} />
          <span>Developer Computer</span>
        </button>
      </div>

      <div className={styles.heroContentWrapper}>
        <div className={styles.heroTextBlock}>
          {/* Animated Status Pill with "Full-Stack MERN Developer" & "MySQL Live" */}
          <div className={styles.heroStatusPill}>
            <span className={styles.pulsingBeacon} />
            <span className={styles.pillTextAnimated}>Full-Stack MERN Developer</span>
            {isDbOnline && (
              <span className={styles.dbLiveTag}>
                <CheckCircle2 size={12} className={styles.tagCheckIcon} />
                <span>MySQL Live</span>
              </span>
            )}
          </div>

          {/* Animated "Sosna Hailu" Main Heading with Shimmer Wave */}
          <h1 className={styles.heroMainTitle}>
            Sosna Hailu
          </h1>

          {/* Animated "React.js & Node.js Full-Stack Developer" Typewriter */}
          <div className={styles.heroAnimatedRole}>
            <Terminal size={22} className={styles.roleTerminalIcon} />
            <span className={styles.roleText}>{displayText}</span>
            <span className={styles.blinkingCursor}>|</span>
          </div>

          {/* Clean Summary Description */}
          <p className={styles.heroSummaryText}>
            Specializing in high-performance React web applications backed by scalable
            Node.js, Express APIs and MySQL databases. Featuring 3 live deployed projects.
          </p>

          {/* Action Buttons */}
          <div className={styles.heroButtonRow}>
            <a href="#projects" className={`btn btn-primary ${styles.btnAnimatedGlow}`}>
              <span>View 3 Featured Projects</span>
              <ArrowRight size={18} className={styles.arrowHoverIcon} />
            </a>
            <a href="#contact" className="btn btn-secondary">
              <span>Contact Me</span>
              <Code size={18} />
            </a>
          </div>

          {/* 3 Featured Projects Navigation Bar */}
          <div className={styles.heroProjectsBar}>
            <span className={styles.projectsBarLabel}>Featured Works:</span>
            <div className={styles.projectsBarItems}>
              <a href="#projects" className={styles.projPill}>1. Netflix Clone</a>
              <a href="#projects" className={styles.projPill}>2. ChatGPT Clone</a>
              <a href="#projects" className={styles.projPill}>3. AI Evangadi Forum</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
