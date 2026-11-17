const { getPool, isDbOnline, getFallbackStorage } = require('../config/db');

exports.getAllProjects = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const pool = getPool();

    if (pool && isDbOnline()) {
      let query = 'SELECT * FROM projects WHERE 1=1';
      const params = [];

      if (category && category !== 'all') {
        query += ' AND (category = ? OR technologies LIKE ?)';
        params.push(category, `%${category}%`);
      }

      if (search) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ' ORDER BY sort_order ASC, created_at DESC';

      const [rows] = await pool.query(query, params);
      const parsedRows = rows.map(item => {
        try {
          return {
            ...item,
            technologies: typeof item.technologies === 'string' ? JSON.parse(item.technologies) : item.technologies
          };
        } catch {
          return item;
        }
      });

      return res.json({
        success: true,
        source: 'mysql',
        count: parsedRows.length,
        data: parsedRows
      });
    }

    // Fallback store
    const fallback = getFallbackStorage();
    let projects = fallback.projects;

    if (category && category !== 'all') {
      projects = projects.filter(p => p.category === category || (p.technologies && p.technologies.includes(category)));
    }

    return res.json({
      success: true,
      source: 'fallback-cache',
      count: projects.length,
      data: projects
    });
  } catch (err) {
    next(err);
  }
};

exports.getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const pool = getPool();

    if (pool && isDbOnline()) {
      const [rows] = await pool.query('SELECT * FROM projects WHERE slug = ? LIMIT 1', [slug]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Project not found.' });
      }

      const project = rows[0];
      try {
        project.technologies = typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies;
      } catch {}

      return res.json({
        success: true,
        source: 'mysql',
        data: project
      });
    }

    const fallback = getFallbackStorage();
    const proj = fallback.projects.find(p => p.slug === slug);
    if (!proj) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    return res.json({
      success: true,
      source: 'fallback-cache',
      data: proj
    });
  } catch (err) {
    next(err);
  }
};
