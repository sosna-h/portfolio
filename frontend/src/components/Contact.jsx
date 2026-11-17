import React, { useState } from 'react';
import {
  Mail,
  Send,
  User,
  AtSign,
  CheckCircle,
  AlertCircle,
  Loader2,
  Database,
  Inbox,
  Clock,
  Trash2
} from 'lucide-react';
import styles from './Contact.module.css';

export default function Contact({ backendStatus, onMessageSent }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [showInbox, setShowInbox] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [inboxLoading, setInboxLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your name.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Subject is required.';
    } else if (formData.subject.trim().length < 3) {
      errs.subject = 'Subject must be at least 3 characters.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Message content is required.';
    } else if (formData.message.trim().length < 5) {
      errs.message = 'Message must be at least 5 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMessage({
          type: 'success',
          text: data.message || 'Your message has been stored successfully in MySQL!',
          source: data.source
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        if (onMessageSent) onMessageSent();
        if (showInbox) loadInboxMessages();
      } else {
        let msg = data.message || 'Submission failed. Please check the fields.';
        if (data.errors && Array.isArray(data.errors)) {
          msg = data.errors.map((err) => err.message).join(' ');
        }
        setStatusMessage({
          type: 'error',
          text: msg
        });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Unable to reach the backend service on port 5000. Please ensure the Express server is running.'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadInboxMessages = async () => {
    setInboxLoading(true);
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setInboxMessages(json.data);
        }
      }
    } catch (err) {
      console.warn('Inbox fetch error:', err);
    } finally {
      setInboxLoading(false);
    }
  };

  const toggleInbox = () => {
    if (!showInbox) {
      loadInboxMessages();
    }
    setShowInbox(!showInbox);
  };

  const handleDeleteMessage = async (id) => {
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInboxMessages(prev => prev.filter(m => m.id !== id));
        onMessageSent && onMessageSent();
      }
    } catch (err) {
      console.warn('Failed to delete message:', err);
    }
  };

  const handleClearAllMessages = async () => {
    if (!window.confirm('Are you sure you want to delete all stored messages from the database?')) {
      return;
    }
    try {
      const res = await fetch('/api/contact', { method: 'DELETE' });
      if (res.ok) {
        setInboxMessages([]);
        onMessageSent && onMessageSent();
      }
    } catch (err) {
      console.warn('Failed to clear messages:', err);
    }
  };

  const isDbOnline = backendStatus?.database?.online;

  return (
    <section id="contact" className="section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-subtitle">
            <Mail size={16} />
            <span>Connect &amp; Collaborate</span>
          </div>
          <h2 className="section-title">
            Let's Build Something <span className="gradient-text">Exceptional</span>
          </h2>
          <p className="section-description">
            I am actively interviewing for junior full-stack developer roles, MERN internships, and collaborative software projects.
          </p>
        </div>

        <div className={styles.contactLayout}>
          {/* Left Column: Direct Info Card & Live Database Status */}
          <div className={styles.contactInfoPanel}>
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 className={styles.panelTitle}>Direct Inquiries</h3>
              <p className={styles.panelSubtitle}>
                Feel free to send a message via the form or reach out directly through any platform.
              </p>

              <div className={styles.infoEntry}>
                <div className={styles.entryIcon}><User size={18} /></div>
                <div>
                  <span className={styles.entryLabel}>Location / Status</span>
                  <span className={styles.entryVal}>Open to Remote &amp; On-Site Roles</span>
                </div>
              </div>

              <div className={styles.infoEntry}>
                <div className={styles.entryIcon}><AtSign size={18} /></div>
                <div>
                  <span className={styles.entryLabel}>Email</span>
                  <a href="mailto:Sosnagoitom12@gmail.com" className={styles.entryLink}>
                    Sosnagoitom12@gmail.com
                  </a>
                </div>
              </div>

              <div className={styles.infoEntry}>
                <div className={styles.entryIcon}><Database size={18} /></div>
                <div>
                  <span className={styles.entryLabel}>Backend Persistence</span>
                  <span className={styles.entryVal}>
                    {isDbOnline ? 'MySQL Database (portfolio_db)' : 'Express In-Memory Storage'}
                  </span>
                </div>
              </div>

              {/* Toggle Live Inbox Button */}
              <div className={styles.inboxToggleWrap}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                  onClick={toggleInbox}
                >
                  <Inbox size={16} />
                  <span>{showInbox ? 'Hide MySQL Messages' : 'View Stored Messages'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Full-Stack React Contact Form */}
          <div className={styles.contactFormPanel}>
            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '28px' }} noValidate>
              <div className={styles.formHeaderRow}>
                <h3 className={styles.panelTitle}>Send a Direct Message</h3>
                <span className={styles.syncBadge}>
                  <span className={styles.pulseDot} />
                  <span>REST API Connected</span>
                </span>
              </div>

              {/* Status Alert Banner */}
              {statusMessage && (
                <div className={`${styles.statusAlert} ${statusMessage.type === 'success' ? styles.success : styles.error}`}>
                  {statusMessage.type === 'success' ? (
                    <CheckCircle size={18} className={styles.alertIcon} />
                  ) : (
                    <AlertCircle size={18} className={styles.alertIcon} />
                  )}
                  <div className={styles.alertText}>
                    <p>{statusMessage.text}</p>
                    {statusMessage.source && (
                      <small className={styles.alertMeta}>
                        Stored in: <strong>{statusMessage.source.toUpperCase()}</strong>
                      </small>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.formRow2}>
                {/* Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="name">Your Name <span className={styles.req}>*</span></label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Elena Rostova"
                    className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
                    disabled={loading}
                  />
                  {errors.name && <span className={styles.errorHint}>{errors.name}</span>}
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                  <label htmlFor="email">Your Email <span className={styles.req}>*</span></label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. elena@company.com"
                    className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                    disabled={loading}
                  />
                  {errors.email && <span className={styles.errorHint}>{errors.email}</span>}
                </div>
              </div>

              {/* Subject */}
              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject <span className={styles.req}>*</span></label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Full-Stack Developer Position / Project Inquiry"
                  className={`${styles.formInput} ${errors.subject ? styles.inputError : ''}`}
                  disabled={loading}
                />
                {errors.subject && <span className={styles.errorHint}>{errors.subject}</span>}
              </div>

              {/* Message */}
              <div className={styles.formGroup}>
                <label htmlFor="message">Message <span className={styles.req}>*</span></label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hello Sosna! I reviewed your portfolio and would like to discuss..."
                  className={`${styles.formInput} ${errors.message ? styles.inputError : ''}`}
                  disabled={loading}
                />
                {errors.message && <span className={styles.errorHint}>{errors.message}</span>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    <span>Writing to MySQL Database...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message via Express API</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Expandable Live Messages Drawer */}
        {showInbox && (
          <div className={`${styles.inboxSection} glass-panel`}>
            <div className={styles.inboxHeader}>
              <div className={styles.inboxTitleBox}>
                <Inbox size={20} style={{ color: 'var(--accent-cyan)' }} />
                <h4 className={styles.inboxTitle}>Live Contact Messages from MySQL</h4>
              </div>
              <div className={styles.inboxHeaderActions}>
                {inboxMessages.length > 0 && (
                  <button
                    type="button"
                    className={styles.clearAllBtn}
                    onClick={handleClearAllMessages}
                    title="Clear all messages from MySQL"
                  >
                    <Trash2 size={14} />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={loadInboxMessages}
                  disabled={inboxLoading}
                >
                  {inboxLoading ? 'Refreshing...' : 'Refresh Inbox'}
                </button>
              </div>
            </div>

            {inboxLoading ? (
              <div className={styles.inboxLoading}>
                <Loader2 size={24} className={styles.spinner} />
                <span>Fetching records from MySQL...</span>
              </div>
            ) : inboxMessages.length === 0 ? (
              <p className={styles.inboxEmpty}>No messages currently stored.</p>
            ) : (
              <div className={styles.inboxList}>
                {inboxMessages.map((msg) => (
                  <div key={msg.id} className={styles.inboxItem}>
                    <div className={styles.inboxItemTop}>
                      <div>
                        <strong className={styles.inboxAuthor}>{msg.name}</strong>
                        <span className={styles.inboxEmail}>({msg.email})</span>
                      </div>
                      <div className={styles.inboxTopRight}>
                        <span className={styles.inboxTime}>
                          <Clock size={12} />
                          {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'Just now'}
                        </span>
                        <button
                          type="button"
                          className={styles.deleteMsgBtn}
                          onClick={() => handleDeleteMessage(msg.id)}
                          title="Delete this message"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                    <div className={styles.inboxSubject}>
                      <strong>Subject:</strong> {msg.subject}
                    </div>
                    <div className={styles.inboxBody}>{msg.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
