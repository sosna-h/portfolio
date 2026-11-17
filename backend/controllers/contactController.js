const { getPool, isDbOnline, getFallbackStorage } = require('../config/db');

exports.createContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const pool = getPool();

    if (pool && isDbOnline()) {
      const [result] = await pool.query(
        'INSERT INTO contact_messages (name, email, subject, message, ip_address) VALUES (?, ?, ?, ?, ?)',
        [name, email, subject, message, ipAddress]
      );

      return res.status(201).json({
        success: true,
        source: 'mysql',
        message: 'Your message has been saved successfully in the database!',
        data: {
          id: result.insertId,
          name,
          email,
          subject,
          createdAt: new Date().toISOString()
        }
      });
    }

    // Fallback store if MySQL is momentarily unavailable
    const fallback = getFallbackStorage();
    const newMsg = {
      id: fallback.contact_messages.length + 1,
      name,
      email,
      subject,
      message,
      ip_address: ipAddress,
      created_at: new Date().toISOString()
    };
    fallback.contact_messages.push(newMsg);

    return res.status(201).json({
      success: true,
      source: 'fallback-cache',
      message: 'Your message has been received and saved to local memory!',
      data: newMsg
    });
  } catch (err) {
    next(err);
  }
};

exports.getContactMessages = async (req, res, next) => {
  try {
    const pool = getPool();
    if (pool && isDbOnline()) {
      const [rows] = await pool.query(
        'SELECT id, name, email, subject, message, is_read, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 50'
      );
      return res.json({
        success: true,
        source: 'mysql',
        count: rows.length,
        data: rows
      });
    }

    const fallback = getFallbackStorage();
    return res.json({
      success: true,
      source: 'fallback-cache',
      count: fallback.contact_messages.length,
      data: fallback.contact_messages
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    if (pool && isDbOnline()) {
      const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Message not found or already deleted.'
        });
      }
      return res.json({
        success: true,
        source: 'mysql',
        message: 'Message deleted successfully from database.'
      });
    }

    const fallback = getFallbackStorage();
    const initialLen = fallback.contact_messages.length;
    fallback.contact_messages = fallback.contact_messages.filter(m => String(m.id) !== String(id));
    if (fallback.contact_messages.length === initialLen) {
      return res.status(404).json({
        success: false,
        message: 'Message not found in memory.'
      });
    }

    return res.json({
      success: true,
      source: 'fallback-cache',
      message: 'Message deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

exports.clearAllContactMessages = async (req, res, next) => {
  try {
    const pool = getPool();
    if (pool && isDbOnline()) {
      await pool.query('TRUNCATE TABLE contact_messages');
      return res.json({
        success: true,
        source: 'mysql',
        message: 'All messages have been cleared from the database.'
      });
    }

    const fallback = getFallbackStorage();
    fallback.contact_messages = [];
    return res.json({
      success: true,
      source: 'fallback-cache',
      message: 'All messages have been cleared from memory.'
    });
  } catch (err) {
    next(err);
  }
};

