import React from 'react';
import {
  Home,
  User,
  Cpu,
  FolderGit2,
  Briefcase,
  BarChart3,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Database,
  Menu,
  X
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar({
  activeSection,
  setActiveSection,
  backendStatus,
  isMobileOpen,
  setIsMobileOpen
}) {
  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'stats', label: 'Live Metrics', icon: BarChart3 },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setIsMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isDbOnline = backendStatus?.database?.online;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className={styles.mobileToggle}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop overlay for mobile */}
      {isMobileOpen && (
        <div
          className={styles.sidebarBackdrop}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarInner}>
          {/* Profile Section */}
          <div className={styles.profileBlock}>
            <div className={styles.avatarWrapper}>
              <img
                src="/assets/img/sosna-photo.jpg"
                alt="Sosna Hailu"
                className={styles.avatarImg}
                onError={(e) => {
                  e.target.src = '/assets/img/sosna-profile.jpg';
                }}
              />
              <div
                className={`${styles.statusIndicator} ${
                  isDbOnline ? styles.online : styles.offline
                }`}
              />
            </div>

            <h1 className={styles.profileName}>Sosna Hailu</h1>
            <p className={styles.profileTitle}>Full-Stack MERN Developer</p>

            {/* Live Database Pill */}
            <div className={styles.livePill} title="Live status from Node.js Express & MySQL backend">
              <Database
                size={13}
                className={isDbOnline ? styles.textEmerald : styles.textAmber}
              />
              <span>{isDbOnline ? 'MySQL Online :5000' : 'Backend Standby'}</span>
            </div>

            {/* Social Links */}
            <div className={styles.socialLinks}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Profile"
                className={styles.socialBtn}
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className={styles.socialBtn}
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:Sosnagoitom12@gmail.com"
                title="Email Sosna (Sosnagoitom12@gmail.com)"
                className={styles.socialBtn}
              >
                <Mail size={18} />
              </a>
              <a
                href="https://ai-powered-forum-project-delta.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                title="Live Vercel Project"
                className={styles.socialBtn}
              >
                <ExternalLink size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className={styles.navMenu}>
            <ul className={styles.navList}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                      onClick={() => handleNavClick(item.id)}
                    >
                      <Icon size={19} className={styles.navIcon} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer badge */}
          <div className={styles.sidebarFooter}>
            <span className={styles.techBadge}>React 18 + Node.js API</span>
          </div>
        </div>
      </aside>
    </>
  );
}
