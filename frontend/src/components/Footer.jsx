import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footerContainer}>
      <div className="section-container">
        <div className={styles.footerInner}>
          <div className={styles.footerLeft}>
            <h3 className={styles.footerBrand}>Sosna Hailu</h3>
            <p className={styles.footerTagline}>
              MERN Stack Developer &amp; Tech Professional • Building scalable web products.
            </p>
            <div className={styles.footerStackPill}>
              React 18 • Node.js • Express • MySQL • Vercel
            </div>
          </div>

          <div className={styles.footerRight}>
            <div className={styles.footerSocials}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerSocialBtn}
                title="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerSocialBtn}
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:Sosnagoitom12@gmail.com"
                className={styles.footerSocialBtn}
                title="Email Sosna (Sosnagoitom12@gmail.com)"
              >
                <Mail size={18} />
              </a>
            </div>

            <button
              onClick={scrollToTop}
              className={styles.scrollTopBtn}
              title="Back to Top"
            >
              <span>Back to Top</span>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Sosna Hailu. All rights reserved.</p>
          <p className={styles.footerCrafted}>
            Engineered with modern React &amp; Node.js architecture.
          </p>
        </div>
      </div>
    </footer>
  );
}
