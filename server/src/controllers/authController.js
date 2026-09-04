const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { dbRun, dbGet } = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email, and password are required.' });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (cleanUsername.length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters and alphanumeric.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Check existing username or email
    const existingUser = await dbGet(
      'SELECT id, username, email FROM users WHERE username = ? OR email = ?',
      [cleanUsername, email.toLowerCase()]
    );

    if (existingUser) {
      if (existingUser.username.toLowerCase() === cleanUsername) {
        return res.status(409).json({ success: false, message: 'This username is already taken. Please choose another.' });
      }
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userInsert = await dbRun(
      'INSERT INTO users (username, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
      [cleanUsername, email.toLowerCase(), password_hash, 'USER', 'ACTIVE']
    );

    const userId = userInsert.lastID;

    // Create profile
    await dbRun(
      'INSERT INTO profiles (user_id, full_name, professional_title, short_intro, about) VALUES (?, ?, ?, ?, ?)',
      [userId, fullName || cleanUsername, 'Aspiring Professional', 'Welcome to my portfolio!', '']
    );

    // Create default portfolio record
    await dbRun(
      'INSERT INTO portfolios (user_id, slug, template, theme, status) VALUES (?, ?, ?, ?, ?)',
      [userId, cleanUsername, 'modern', 'dark', 'draft']
    );

    // Create default settings
    await dbRun(
      'INSERT INTO user_settings (user_id, contact_visible, resume_downloadable, email_visible, phone_visible) VALUES (?, 1, 1, 1, 0)',
      [userId]
    );

    const user = await dbGet('SELECT id, username, email, role, status, created_at FROM users WHERE id = ?', [userId]);
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration. Please try again.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // email or username

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Username/Email and password are required.' });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const user = await dbGet(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [cleanIdentifier, cleanIdentifier]
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated by administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please check and try again.' });
    }

    // Update last login
    await dbRun('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    const token = generateToken(user);
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      last_login: new Date().toISOString()
    };

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await dbGet('SELECT id, username, email, role, status, created_at, last_login FROM users WHERE id = ?', [req.user.id]);
    const portfolio = await dbGet('SELECT slug, status, template, theme FROM portfolios WHERE user_id = ?', [req.user.id]);
    const profile = await dbGet('SELECT full_name, professional_title, profile_image FROM profiles WHERE user_id = ?', [req.user.id]);

    return res.json({
      success: true,
      user,
      portfolio,
      profile
    });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your account email.' });
    }

    const user = await dbGet('SELECT id, email, username FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      // Do not reveal whether user exists for security, but return friendly message
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset token has been generated.'
      });
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    const expiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    await dbRun('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?', [resetToken, expiry, user.id]);

    return res.json({
      success: true,
      message: 'Reset token generated successfully. In production this would be sent to your email.',
      resetToken, // Provided for easy manual testing / demonstration
      instructions: 'Use this reset token on the reset password page.'
    });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process forgot password request.' });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const user = await dbGet(
      'SELECT id, reset_token_expiry FROM users WHERE reset_token = ?',
      [token]
    );

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    }

    if (user.reset_token_expiry && new Date(user.reset_token_expiry) < new Date()) {
      return res.status(400).json({ success: false, message: 'Reset token has expired. Please request a new one.' });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await dbRun(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [password_hash, user.id]
    );

    return res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.'
    });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
};

// POST /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = await dbGet('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await dbRun('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newHash, req.user.id]);

    return res.json({ success: true, message: 'Password updated successfully!' });
  } catch (err) {
    console.error('changePassword error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword
};
