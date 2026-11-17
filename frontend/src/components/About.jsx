import React from 'react';
import { User, Code2, Server, Database, Globe, Award } from 'lucide-react';
import styles from './About.module.css';

export default function About() {
  const highlights = [
    {
      title: 'Full-Stack MERN Architecture',
      description: 'Specialized in building cohesive end-to-end applications with React client interfaces and Express/Node APIs.',
      icon: Code2,
      color: '#38bdf8'
    },
    {
      title: 'Database Design & Relational Logic',
      description: 'Hands-on experience structuring MySQL relational schemas as well as flexible MongoDB NoSQL document collections.',
      icon: Database,
      color: '#10b981'
    },
    {
      title: 'Modern RESTful API Engineering',
      description: 'Designing clean endpoints with express-validator, robust error handling, CORS security, and resilient database fallbacks.',
      icon: Server,
      color: '#818cf8'
    },
    {
      title: 'Continuous Deployment & Vercel Hosting',
      description: 'Proven track record of shipping live production builds directly to Vercel, integrating external APIs like TMDB and AI models.',
      icon: Globe,
      color: '#f59e0b'
    }
  ];

  const infoItems = [
    { label: 'Role', value: 'Full-Stack MERN Developer' },
    { label: 'Primary Stack', value: 'React.js, Node.js, Express, MySQL' },
    { label: 'Secondary Stack', value: 'MongoDB, JavaScript (ES6+), CSS3' },
    { label: 'Email', value: 'Sosnagoitom12@gmail.com' },
    { label: 'Live Projects', value: '3 Active Deployed Web Apps' },
    { label: 'Availability', value: 'Open for Roles & Internships' },
  ];

  return (
    <section id="about" className="section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-subtitle">
            <User size={16} />
            <span>Developer Profile</span>
          </div>
          <h2 className="section-title">
            Passionate About Crafting <span className="gradient-text">Impactful Web Solutions</span>
          </h2>
          <p className="section-description">
            A dedicated software developer with deep passion for modern JavaScript ecosystems, clean architectural design, and crafting intuitive user experiences.
          </p>
        </div>

        {/* Content Grid */}
        <div className={styles.aboutGrid}>
          {/* Left Column: Image and Key Info Card */}
          <div className={styles.aboutLeft}>
            <div className={`${styles.profileCard} glass-panel`}>
              <div className={styles.profileImageContainer}>
                <img
                  src="/assets/img/sosna-photo.jpg"
                  alt="Sosna Hailu"
                  className={styles.profileFeatureImg}
                  onError={(e) => {
                    e.target.src = '/assets/img/sosna-profile.jpg';
                  }}
                />
              </div>

              <div className={styles.profileInfoList}>
                {infoItems.map((item, idx) => (
                  <div key={idx} className={styles.infoRow}>
                    <span className={styles.infoLabel}>{item.label}:</span>
                    <span className={styles.infoValue}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="profile-action">
                <a
                  href="#contact"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <Award size={16} /> Discuss Opportunities
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Architecture Highlights */}
          <div className={styles.aboutRight}>
            <div className={`${styles.bioBlock} glass-panel`}>
              <h3 className={styles.bioHeading}>Who I Am</h3>
              <p className={styles.bioText}>
                I am Sosna Hailu, an aspiring full-stack software engineer driven by curiosity, analytical thinking, and the satisfaction of translating complex logic into seamless digital experiences.
              </p>
              <p className={styles.bioText}>
                My journey centers around mastering the full JavaScript stack—from developing responsive, stateful component hierarchies in <strong>React</strong> to engineering resilient <strong>Node.js &amp; Express</strong> servers wired to <strong>MySQL</strong> and <strong>MongoDB</strong> databases.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className={styles.highlightsGrid}>
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className={`${styles.highlightCard} glass-panel`}>
                    <div
                      className={styles.highlightIconBox}
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      <Icon size={24} />
                    </div>
                    <h4 className={styles.highlightTitle}>{item.title}</h4>
                    <p className={styles.highlightDesc}>{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
