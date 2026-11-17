-- ============================================================
-- Sosna Hailu Portfolio — Full MySQL Setup
-- Run this in MySQL Workbench or mysql command line
-- ============================================================

-- 1. Create database
CREATE DATABASE IF NOT EXISTS `portfolio_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `portfolio_db`;

-- 2. Contact Messages Table
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id`         INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(100)     NOT NULL,
  `email`      VARCHAR(255)     NOT NULL,
  `subject`    VARCHAR(150)     NOT NULL,
  `message`    TEXT             NOT NULL,
  `ip_address` VARCHAR(45)      DEFAULT NULL,
  `is_read`    TINYINT(1)       NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email`      (`email`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
  `id`               INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`            VARCHAR(150)     NOT NULL,
  `slug`             VARCHAR(150)     NOT NULL UNIQUE,
  `description`      TEXT             NOT NULL,
  `long_description` TEXT             DEFAULT NULL,
  `image_url`        VARCHAR(500)     DEFAULT NULL,
  `github_url`       VARCHAR(500)     DEFAULT NULL,
  `live_url`         VARCHAR(500)     DEFAULT NULL,
  `technologies`     LONGTEXT         DEFAULT NULL,
  `category`         VARCHAR(50)      DEFAULT 'fullstack',
  `featured`         TINYINT(1)       NOT NULL DEFAULT 1,
  `status`           ENUM('complete','in-progress','sample') NOT NULL DEFAULT 'complete',
  `sort_order`       INT(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at`       TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_slug`     (`slug`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Seed Projects (matches backend fallback data exactly)
INSERT IGNORE INTO `projects`
  (title, slug, description, long_description, image_url, github_url, live_url, technologies, category, featured, status, sort_order)
VALUES
(
  'AI-Powered Evangadi Forum',
  'ai-powered-forum',
  'A full-featured developer community Q&A platform built on the MERN stack with automated AI assistant responses.',
  'The AI-Powered Evangadi Forum facilitates technical discussions among developers and students. Features automated AI query responses, categorized thread feeds, question upvotes, user authentication, and responsive mobile architecture.',
  '/assets/img/portfolio/ai-forum.jpg',
  'https://github.com',
  'https://ai-powered-forum-project-delta.vercel.app/',
  '["MongoDB","Express.js","React.js","Node.js","AI Assistant API","Vercel"]',
  'mern', 1, 'complete', 1
),
(
  'ChatGPT Clone Web App',
  'chatgpt-clone',
  'A fast, modern conversational AI web application featuring real-time stream responses, prompt history, and dark mode UI.',
  'Interactive AI chat interface mirroring OpenAI ChatGPT. Includes dynamic prompt session drawers, code block syntax highlighting, multi-turn conversation memory, and clean obsidian dark theme styling.',
  '/assets/img/portfolio/chatgpt-clone.jpg',
  'https://github.com',
  'https://chat-gpt-clone-eta-one.vercel.app/',
  '["React.js","Node.js","OpenAI API","Modern CSS","Vercel"]',
  'ai', 1, 'complete', 2
),
(
  'Netflix Streaming Clone',
  'netflix-clone',
  'High-fidelity entertainment streaming application with dynamic TMDB movie catalogs, hero trailers, and carousels.',
  'A recreation of the Netflix streaming platform UI with live data from The Movie Database (TMDB). Features dynamic category rows, hero preview video banners, YouTube trailer playback modals, and responsive layout.',
  '/assets/img/portfolio/netflix-clone.jpg',
  'https://github.com',
  'https://netflix-clone-ivory-two.vercel.app/',
  '["React.js","TMDB REST API","Axios","YouTube API","Vercel"]',
  'react', 1, 'complete', 3
);

-- ============================================================
-- Done. Your portfolio_db is ready.
-- ============================================================
