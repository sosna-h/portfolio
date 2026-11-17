const { getPool, isDbOnline, getFallbackStorage } = require('../config/db');

const initialProjects = [
  {
    title: 'AI-Powered Evangadi Forum',
    slug: 'ai-powered-forum',
    description: 'A full-featured developer community Q&A platform built on the MERN stack with automated AI assistant responses.',
    long_description: 'The AI-Powered Evangadi Forum facilitates technical discussions among developers and students. Features automated AI query responses, categorized thread feeds, question upvotes, user authentication, and responsive mobile architecture.',
    image_url: '/assets/img/portfolio/ai-forum.jpg',
    github_url: 'https://github.com',
    live_url: 'https://ai-powered-forum-project-delta.vercel.app/',
    technologies: JSON.stringify(['MongoDB', 'Express.js', 'React.js', 'Node.js', 'AI Assistant API', 'Vercel']),
    category: 'mern',
    featured: 1,
    status: 'complete',
    sort_order: 1
  },
  {
    title: 'ChatGPT Clone Web App',
    slug: 'chatgpt-clone',
    description: 'A fast, modern conversational AI web application featuring real-time stream responses, prompt history, and dark mode UI.',
    long_description: 'Interactive AI chat interface mirroring OpenAI ChatGPT. Includes dynamic prompt session drawers, code block syntax highlighting, multi-turn conversation memory, and clean obsidian dark theme styling.',
    image_url: '/assets/img/portfolio/chatgpt-clone.jpg',
    github_url: 'https://github.com',
    live_url: 'https://chat-gpt-clone-eta-one.vercel.app/',
    technologies: JSON.stringify(['React.js', 'Node.js', 'OpenAI API', 'Modern CSS', 'Vercel']),
    category: 'ai',
    featured: 1,
    status: 'complete',
    sort_order: 2
  },
  {
    title: 'Netflix Streaming Clone',
    slug: 'netflix-clone',
    description: 'High-fidelity entertainment streaming application with dynamic TMDB movie catalogs, hero trailers, and carousels.',
    long_description: 'A recreation of the Netflix streaming platform UI with live data from The Movie Database (TMDB). Features dynamic category rows, hero preview video banners, YouTube trailer playback modals, and responsive layout.',
    image_url: '/assets/img/portfolio/netflix-clone.jpg',
    github_url: 'https://github.com',
    live_url: 'https://netflix-clone-ivory-two.vercel.app/',
    technologies: JSON.stringify(['React.js', 'TMDB REST API', 'Axios', 'YouTube API', 'Vercel']),
    category: 'react',
    featured: 1,
    status: 'complete',
    sort_order: 3
  }
];

async function setupTablesAndSeed() {
  const fallback = getFallbackStorage();
  fallback.projects = initialProjects.map((p, idx) => ({ id: idx + 1, ...p }));

  const pool = getPool();
  if (!pool || !isDbOnline()) {
    console.log('[DB Init] Running with cached fallback project data.');
    return;
  }

  try {
    // 1. Create tables if not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`contact_messages\` (
        \`id\` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`subject\` VARCHAR(150) NOT NULL,
        \`message\` TEXT NOT NULL,
        \`ip_address\` VARCHAR(45) DEFAULT NULL,
        \`is_read\` TINYINT(1) NOT NULL DEFAULT 0,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_email\` (\`email\`),
        KEY \`idx_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`projects\` (
        \`id\` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        \`title\` VARCHAR(150) NOT NULL,
        \`slug\` VARCHAR(150) NOT NULL UNIQUE,
        \`description\` TEXT NOT NULL,
        \`long_description\` TEXT DEFAULT NULL,
        \`image_url\` VARCHAR(500) DEFAULT NULL,
        \`github_url\` VARCHAR(500) DEFAULT NULL,
        \`live_url\` VARCHAR(500) DEFAULT NULL,
        \`technologies\` LONGTEXT DEFAULT NULL,
        \`category\` VARCHAR(50) DEFAULT 'fullstack',
        \`featured\` TINYINT(1) NOT NULL DEFAULT 1,
        \`status\` ENUM('complete','in-progress','sample') NOT NULL DEFAULT 'complete',
        \`sort_order\` INT(10) UNSIGNED NOT NULL DEFAULT 0,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_slug\` (\`slug\`),
        KEY \`idx_category\` (\`category\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Check and seed initial projects
    for (const proj of initialProjects) {
      const [rows] = await pool.query('SELECT id FROM projects WHERE slug = ?', [proj.slug]);
      if (rows.length === 0) {
        await pool.query(
          `INSERT INTO projects (title, slug, description, long_description, image_url, github_url, live_url, technologies, category, featured, status, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            proj.title,
            proj.slug,
            proj.description,
            proj.long_description,
            proj.image_url,
            proj.github_url,
            proj.live_url,
            proj.technologies,
            proj.category,
            proj.featured,
            proj.status,
            proj.sort_order
          ]
        );
        console.log(`[DB Init] Seeded project: ${proj.title}`);
      }
    }

    console.log('[DB Init] MySQL database tables and seed records verified.');
  } catch (err) {
    console.error('[DB Init Error]:', err.message);
  }
}

module.exports = {
  setupTablesAndSeed,
  initialProjects
};
