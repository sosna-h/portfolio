import React from 'react';
import { Briefcase, Code, Server, Database, Bot, ArrowUpRight } from 'lucide-react';
import styles from './Services.module.css';

const servicesData = [
  {
    title: 'Full-Stack Web App Engineering',
    category: 'React & Node.js',
    icon: Code,
    color: '#38bdf8',
    description: 'Transforming requirements into responsive, interactive single-page applications using React 18, modular CSS design systems, and modern component lifecycle hooks.',
    deliverables: ['Custom React Component Architecture', 'Dynamic State Management', 'Cross-Device Responsive Layouts', 'Lighthouse Performance Tuning']
  },
  {
    title: 'RESTful API & Backend Services',
    category: 'Node.js & Express',
    icon: Server,
    color: '#818cf8',
    description: 'Building robust, secure backend engines equipped with express-validator sanitization, unified error handlers, CORS configuration, and resilient database fallbacks.',
    deliverables: ['CRUD REST Endpoints', 'Payload Validation & Sanitization', 'Centralized Error Handling Middleware', 'Production Ready Routing']
  },
  {
    title: 'Database Architecture & Modeling',
    category: 'MySQL & MongoDB',
    icon: Database,
    color: '#10b981',
    description: 'Designing scalable data models, relational tables with index keys in MySQL, and schema validation with collections in MongoDB for reliable data persistence.',
    deliverables: ['MySQL Relational Schema Design', 'Query Optimization & Indexing', 'Automatic DB Init & Seeding Scripts', 'In-Memory Fallback Handling']
  },
  {
    title: 'AI & External API Integrations',
    category: 'OpenAI, TMDB, Vercel',
    icon: Bot,
    color: '#f59e0b',
    description: 'Enriching web applications with generative AI capabilities, real-time streaming conversations, third-party media REST endpoints, and seamless cloud deployments.',
    deliverables: ['Conversational AI Assistants', 'External REST API Orchestration', 'Vercel Production Deployments', 'Secure Environment Configuration']
  }
];

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-subtitle">
            <Briefcase size={16} />
            <span>Engineering Capabilities</span>
          </div>
          <h2 className="section-title">
            What I <span className="gradient-text">Build &amp; Deliver</span>
          </h2>
          <p className="section-description">
            High-standard engineering solutions across the full stack spectrum, bridging frontend elegance with solid backend systems.
          </p>
        </div>

        {/* Services Grid */}
        <div className={styles.servicesGrid}>
          {servicesData.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div key={idx} className={`${styles.serviceCard} glass-panel`}>
                <div className={styles.serviceTop}>
                  <div
                    className={styles.serviceIconBox}
                    style={{ backgroundColor: `${svc.color}15`, color: svc.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <span className={styles.serviceCategory}>{svc.category}</span>
                </div>

                <h3 className={styles.serviceHeading}>{svc.title}</h3>
                <p className={styles.serviceDescription}>{svc.description}</p>

                <div className={styles.deliverablesBlock}>
                  <span className={styles.deliverablesTitle}>Key Capabilities:</span>
                  <ul className={styles.deliverablesList}>
                    {svc.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className={styles.deliverableItem}>
                        <ArrowUpRight size={13} className={styles.textCyan} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
