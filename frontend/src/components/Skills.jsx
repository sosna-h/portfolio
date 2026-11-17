import React, { useState } from 'react';
import { Cpu, Layers, Terminal, Database, Wrench } from 'lucide-react';
import styles from './Skills.module.css';

const skillCategories = [
  { id: 'all', label: 'All Technologies', icon: Layers },
  { id: 'frontend', label: 'Frontend', icon: Cpu },
  { id: 'backend', label: 'Backend & APIs', icon: Terminal },
  { id: 'database', label: 'Databases', icon: Database },
  { id: 'tools', label: 'Tools & DevOps', icon: Wrench },
];

const skillsData = [
  { name: 'React.js', category: 'frontend', level: 90, icon: '⚛️', desc: 'Component Architecture, Hooks, Context API, Virtual DOM' },
  { name: 'JavaScript (ES6+)', category: 'frontend', level: 92, icon: '📜', desc: 'Async/Await, Promises, Closures, DOM Manipulation' },
  { name: 'Node.js', category: 'backend', level: 88, icon: '🟢', desc: 'Event Loop, Streams, File System, Server Architecture' },
  { name: 'Express.js', category: 'backend', level: 90, icon: '⚡', desc: 'REST APIs, Middleware, Request Validation, Error Handling' },
  { name: 'MySQL', category: 'database', level: 85, icon: '🐬', desc: 'Relational Schema Design, Foreign Keys, Indexing, Queries' },
  { name: 'MongoDB', category: 'database', level: 84, icon: '🍃', desc: 'Document Modeling, Aggregations, Mongoose Schemas' },
  { name: 'HTML5 & Modern CSS3', category: 'frontend', level: 95, icon: '🎨', desc: 'Flexbox, CSS Grid, Responsive Design, Animations' },
  { name: 'RESTful API Engineering', category: 'backend', level: 90, icon: '🔗', desc: 'Status Codes, CRUD Endpoints, Payload Normalization' },
  { name: 'Git & GitHub', category: 'tools', level: 88, icon: '🐙', desc: 'Version Control, Branching, Pull Requests, Code Reviews' },
  { name: 'Vercel Deployment', category: 'tools', level: 92, icon: '▲', desc: 'Production CI/CD, Environment Secrets, Cloud Hosting' },
  { name: 'API Integration (TMDB, AI)', category: 'backend', level: 86, icon: '🤖', desc: 'Axios, Fetch API, Real-time Stream Handling, Rate Limits' },
  { name: 'Vite & Modern Tooling', category: 'tools', level: 88, icon: '⚡', desc: 'Fast HMR, Bundling, Build Optimization' },
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredSkills = activeCategory === 'all'
    ? skillsData
    : skillsData.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-subtitle">
            <Cpu size={16} />
            <span>Technical Mastery</span>
          </div>
          <h2 className="section-title">
            Skills &amp; <span className="gradient-text">Core Competencies</span>
          </h2>
          <p className="section-description">
            A balanced stack bridging modern, dynamic user interfaces with resilient, secure, and production-ready server backends.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className={styles.skillsTabs}>
          {skillCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`${styles.skillTabBtn} ${isActive ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className={styles.skillsGrid}>
          {filteredSkills.map((skill, idx) => (
            <div key={idx} className={`${styles.skillCard} glass-panel`}>
              <div className={styles.skillCardTop}>
                <div className={styles.skillIdentity}>
                  <span className={styles.skillEmoji}>{skill.icon}</span>
                  <div>
                    <h4 className={styles.skillName}>{skill.name}</h4>
                    <span className={styles.skillCategoryBadge}>{skill.category}</span>
                  </div>
                </div>
                <span className={styles.skillPercentage}>{skill.level}%</span>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              <p className={styles.skillDesc}>{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
