const { getPool, isDbOnline, getFallbackStorage } = require('../config/db');

exports.getStats = async (req, res, next) => {
  try {
    const pool = getPool();
    const online = isDbOnline();

    let projectCount = 3;
    let messageCount = 0;

    if (pool && online) {
      try {
        const [[pRes]] = await pool.query('SELECT COUNT(*) as count FROM projects');
        const [[mRes]] = await pool.query('SELECT COUNT(*) as count FROM contact_messages');
        projectCount = pRes.count || 3;
        messageCount = mRes.count || 0;
      } catch (e) {
        console.warn('Error reading stats from DB:', e.message);
      }
    } else {
      const fallback = getFallbackStorage();
      projectCount = fallback.projects.length || 3;
      messageCount = fallback.contact_messages.length || 0;
    }

    return res.json({
      success: true,
      data: {
        database: {
          online: online,
          name: 'portfolio_db',
          host: '127.0.0.1:3306'
        },
        metrics: {
          projectsCount: projectCount,
          messagesCount: messageCount,
          mernTechnologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'MySQL'],
          hoursOfCoding: 150,
          deployedApps: 3
        }
      }
    });
  } catch (err) {
    next(err);
  }
};
