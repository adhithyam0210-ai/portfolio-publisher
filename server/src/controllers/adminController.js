const bcrypt = require('bcryptjs');
const { dbRun, dbGet, dbAll } = require('../config/database');

// GET /api/admin/stats
const getSystemStats = async (req, res) => {
  try {
    const totalUsersRow = await dbGet('SELECT COUNT(*) as count FROM users');
    const activeUsersRow = await dbGet("SELECT COUNT(*) as count FROM users WHERE status = 'ACTIVE'");
    const inactiveUsersRow = await dbGet("SELECT COUNT(*) as count FROM users WHERE status = 'INACTIVE'");
    const totalPortfoliosRow = await dbGet('SELECT COUNT(*) as count FROM portfolios');
    const publishedPortfoliosRow = await dbGet("SELECT COUNT(*) as count FROM portfolios WHERE status = 'published'");
    const unpublishedPortfoliosRow = await dbGet("SELECT COUNT(*) as count FROM portfolios WHERE status != 'published'");
    
    // New registrations in last 7 days
    const recentRegsRow = await dbGet(`
      SELECT COUNT(*) as count FROM users 
      WHERE created_at >= datetime('now', '-7 days')
    `);

    // Total content counters for telemetry
    const totalProjectsRow = await dbGet('SELECT COUNT(*) as count FROM projects');
    const totalResumesRow = await dbGet('SELECT COUNT(*) as count FROM resumes');

    return res.json({
      success: true,
      stats: {
        totalUsers: totalUsersRow ? totalUsersRow.count : 0,
        activeUsers: activeUsersRow ? activeUsersRow.count : 0,
        inactiveUsers: inactiveUsersRow ? inactiveUsersRow.count : 0,
        totalPortfolios: totalPortfoliosRow ? totalPortfoliosRow.count : 0,
        publishedPortfolios: publishedPortfoliosRow ? publishedPortfoliosRow.count : 0,
        unpublishedPortfolios: unpublishedPortfoliosRow ? unpublishedPortfoliosRow.count : 0,
        newRegistrations7d: recentRegsRow ? recentRegsRow.count : 0,
        totalProjects: totalProjectsRow ? totalProjectsRow.count : 0,
        totalResumes: totalResumesRow ? totalResumesRow.count : 0
      }
    });
  } catch (err) {
    console.error('getSystemStats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to compute admin statistics.' });
  }
};

// GET /api/admin/users
const listUsers = async (req, res) => {
  try {
    const { search = '', role = '', status = '', portfolioStatus = '', page = 1, limit = 50 } = req.query;

    let query = `
      SELECT 
        u.id, u.username, u.email, u.role, u.status, u.created_at, u.last_login,
        p.slug, p.status as portfolio_status, p.template, p.theme, p.published_at,
        pr.full_name, pr.professional_title, pr.profile_image,
        (SELECT COUNT(*) FROM projects WHERE user_id = u.id) as project_count,
        (SELECT COUNT(*) FROM education WHERE user_id = u.id) as education_count,
        (SELECT COUNT(*) FROM skills WHERE user_id = u.id) as skill_count,
        (SELECT COUNT(*) FROM experience WHERE user_id = u.id) as experience_count,
        (SELECT COUNT(*) FROM resumes WHERE user_id = u.id) as has_resume
      FROM users u
      LEFT JOIN portfolios p ON u.id = p.user_id
      LEFT JOIN profiles pr ON u.id = pr.user_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (u.username LIKE ? OR u.email LIKE ? OR pr.full_name LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (role && role !== 'ALL') {
      query += ` AND u.role = ?`;
      params.push(role);
    }

    if (status && status !== 'ALL') {
      query += ` AND u.status = ?`;
      params.push(status);
    }

    if (portfolioStatus && portfolioStatus !== 'ALL') {
      query += ` AND p.status = ?`;
      params.push(portfolioStatus);
    }

    query += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const offset = (pageNum - 1) * limitNum;
    params.push(limitNum, offset);

    const users = await dbAll(query, params);

    return res.json({
      success: true,
      users,
      page: pageNum,
      limit: limitNum
    });
  } catch (err) {
    console.error('listUsers error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
  }
};

// GET /api/admin/users/:id
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await dbGet('SELECT id, username, email, role, status, created_at, updated_at, last_login FROM users WHERE id = ?', [id]);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const profile = await dbGet('SELECT * FROM profiles WHERE user_id = ?', [id]);
    const portfolio = await dbGet('SELECT * FROM portfolios WHERE user_id = ?', [id]);
    const resume = await dbGet('SELECT id, original_name, file_size, uploaded_at FROM resumes WHERE user_id = ?', [id]);
    const projectCount = await dbGet('SELECT COUNT(*) as count FROM projects WHERE user_id = ?', [id]);
    const educationCount = await dbGet('SELECT COUNT(*) as count FROM education WHERE user_id = ?', [id]);
    const skillCount = await dbGet('SELECT COUNT(*) as count FROM skills WHERE user_id = ?', [id]);

    return res.json({
      success: true,
      user,
      profile,
      portfolio,
      resume,
      counts: {
        projects: projectCount ? projectCount.count : 0,
        education: educationCount ? educationCount.count : 0,
        skills: skillCount ? skillCount.count : 0
      }
    });
  } catch (err) {
    console.error('getUserDetails error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch user details.' });
  }
};

// PUT /api/admin/users/:id/status
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be ACTIVE or INACTIVE.' });
    }

    // Protect self-deactivation of logged-in admin
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own administrative account.' });
    }

    const user = await dbGet('SELECT id, username, role FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await dbRun('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);

    return res.json({
      success: true,
      message: `User ${user.username} has been ${status === 'ACTIVE' ? 'activated' : 'deactivated'}.`,
      status
    });
  } catch (err) {
    console.error('toggleUserStatus error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update user status.' });
  }
};

// POST /api/admin/users/:id/reset-password
const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = await dbGet('SELECT id, username FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await dbRun('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [password_hash, id]);

    return res.json({
      success: true,
      message: `Password for ${user.username} successfully reset.`
    });
  } catch (err) {
    console.error('resetUserPassword error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reset user password.' });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own administrative account.' });
    }

    const user = await dbGet('SELECT id, username FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // CASCADE foreign keys delete profile, portfolio, education, skills, projects, etc.
    await dbRun('DELETE FROM users WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: `User ${user.username} and all associated data permanently deleted.`
    });
  } catch (err) {
    console.error('deleteUser error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
};

module.exports = {
  getSystemStats,
  listUsers,
  getUserDetails,
  toggleUserStatus,
  resetUserPassword,
  deleteUser
};
