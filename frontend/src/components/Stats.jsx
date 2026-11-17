import React, { useState, useEffect } from 'react';
import { BarChart3, Database, Globe, Clock, MessageSquare, CheckCircle, Activity } from 'lucide-react';
import styles from './Stats.module.css';

export default function Stats({ backendStatus }) {
  const [stats, setStats] = useState({
    projectsCount: 3,
    messagesCount: 17,
    mernTechnologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'MySQL'],
    hoursOfCoding: 150,
    deployedApps: 3
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.metrics) {
            setStats(json.data.metrics);
          }
        }
      } catch (err) {
        // Keeps fallback stats
      }
    }
    loadStats();
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const isDbOnline = backendStatus?.database?.online;

  const statItems = [
    {
      label: 'Live Deployed Apps',
      value: `${stats.deployedApps || 3}`,
      sub: 'Hosted on Vercel Cloud',
      icon: Globe,
      color: '#38bdf8'
    },
    {
      label: 'Full-Stack Core Techs',
      value: '5',
      sub: 'MongoDB, Express, React, Node, MySQL',
      icon: Database,
      color: '#10b981'
    },
    {
      label: 'Architecture Hours',
      value: `${stats.hoursOfCoding || 150}+`,
      sub: 'Clean Code & Optimization',
      icon: Clock,
      color: '#f59e0b'
    },
    {
      label: 'MySQL Inquiries Logged',
      value: `${stats.messagesCount || 0}`,
      sub: 'Real-time Database Records',
      icon: MessageSquare,
      color: '#818cf8'
    }
  ];

  return (
    <section id="stats" className="section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-subtitle">
            <BarChart3 size={16} />
            <span>Telemetry &amp; Database Metrics</span>
          </div>
          <h2 className="section-title">
            Live System <span className="gradient-text">Activity &amp; Performance</span>
          </h2>
          <p className="section-description">
            Real-time telemetry gathered directly from the Node.js Express server and MySQL database layer.
          </p>
        </div>

        {/* Database Status Card */}
        <div className={`${styles.dbTelemetryBanner} glass-panel`}>
          <div className={styles.telemetryLeft}>
            <div className={`${styles.telemetryBeacon} ${isDbOnline ? styles.active : styles.warn}`}>
              <Activity size={20} />
            </div>
            <div>
              <h4 className={styles.telemetryTitle}>
                {isDbOnline ? 'MySQL Database Online & Synced' : 'Express Server Active (Fallback Mode)'}
              </h4>
              <p className={styles.telemetrySubtitle}>
                Endpoint: <code className={styles.telemetryCode}>http://localhost:5000/api</code> • Database: <code className={styles.telemetryCode}>portfolio_db</code>
              </p>
            </div>
          </div>
          <div className="telemetry-right">
            <span className={`${styles.statusPill} ${isDbOnline ? styles.pillGreen : styles.pillYellow}`}>
              <CheckCircle size={13} />
              <span>{isDbOnline ? 'Connected (Port 3306)' : 'Ready (Port 5000)'}</span>
            </span>
          </div>
        </div>

        {/* 4 Metrics Cards */}
        <div className={styles.metricsGrid}>
          {statItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`${styles.metricCard} glass-panel`}>
                <div
                  className={styles.metricIconBox}
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <Icon size={24} />
                </div>
                <div className={styles.metricNumber}>{item.value}</div>
                <div className={styles.metricLabel}>{item.label}</div>
                <div className={styles.metricSub}>{item.sub}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
