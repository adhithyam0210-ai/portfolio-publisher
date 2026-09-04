const path = require('path');
const fs = require('fs');
const { dbRun, dbGet } = require('../config/database');
const { uploadsRoot } = require('../middleware/upload');

// POST /api/upload/avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const relativeUrl = `/uploads/avatars/${req.file.filename}`;
    await dbRun('UPDATE profiles SET profile_image = ? WHERE user_id = ?', [relativeUrl, req.user.id]);

    return res.json({
      success: true,
      message: 'Profile photo uploaded successfully!',
      url: relativeUrl
    });
  } catch (err) {
    console.error('uploadAvatar error:', err);
    return res.status(500).json({ success: false, message: 'Failed to upload profile photo.' });
  }
};

// POST /api/upload/resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No document file uploaded.' });
    }

    const relativePath = `/uploads/resumes/${req.file.filename}`;
    const originalName = req.file.originalname;
    const fileSize = req.file.size;

    // Check if previous resume exists and delete old file
    const existing = await dbGet('SELECT file_path FROM resumes WHERE user_id = ?', [req.user.id]);
    if (existing && existing.file_path) {
      const oldAbsPath = path.join(uploadsRoot, '..', existing.file_path);
      if (fs.existsSync(oldAbsPath)) {
        fs.unlink(oldAbsPath, () => {});
      }
      await dbRun(`
        UPDATE resumes SET
          file_path = ?, original_name = ?, file_size = ?, uploaded_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [relativePath, originalName, fileSize, req.user.id]);
    } else {
      await dbRun(`
        INSERT INTO resumes (user_id, file_path, original_name, file_size)
        VALUES (?, ?, ?, ?)
      `, [req.user.id, relativePath, originalName, fileSize]);
    }

    const updated = await dbGet('SELECT * FROM resumes WHERE user_id = ?', [req.user.id]);
    return res.json({
      success: true,
      message: 'Resume uploaded successfully!',
      resume: updated
    });
  } catch (err) {
    console.error('uploadResume error:', err);
    return res.status(500).json({ success: false, message: 'Failed to upload resume.' });
  }
};

// DELETE /api/upload/resume
const deleteResume = async (req, res) => {
  try {
    const existing = await dbGet('SELECT file_path FROM resumes WHERE user_id = ?', [req.user.id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'No resume found to delete.' });
    }

    const absPath = path.join(uploadsRoot, '..', existing.file_path);
    if (fs.existsSync(absPath)) {
      fs.unlink(absPath, () => {});
    }

    await dbRun('DELETE FROM resumes WHERE user_id = ?', [req.user.id]);

    return res.json({ success: true, message: 'Resume removed successfully.' });
  } catch (err) {
    console.error('deleteResume error:', err);
    return res.status(500).json({ success: false, message: 'Failed to remove resume.' });
  }
};

// GET /api/upload/resume/download/:slug
const downloadResumeBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const portfolio = await dbGet('SELECT user_id, status FROM portfolios WHERE slug = ?', [slug.toLowerCase()]);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found or resume not publicly accessible.' });
    }

    const settings = await dbGet('SELECT resume_downloadable FROM user_settings WHERE user_id = ?', [portfolio.user_id]);
    if (settings && settings.resume_downloadable === 0) {
      return res.status(403).json({ success: false, message: 'Resume downloads are disabled by the owner.' });
    }

    const resume = await dbGet('SELECT file_path, original_name FROM resumes WHERE user_id = ?', [portfolio.user_id]);
    if (!resume || !resume.file_path) {
      return res.status(404).json({ success: false, message: 'Resume document not found.' });
    }

    const absPath = path.join(uploadsRoot, '..', resume.file_path);
    if (!fs.existsSync(absPath)) {
      return res.status(404).json({ success: false, message: 'File not found on server.' });
    }

    return res.download(absPath, resume.original_name);
  } catch (err) {
    console.error('downloadResumeBySlug error:', err);
    return res.status(500).json({ success: false, message: 'Failed to download resume.' });
  }
};

// POST /api/upload/project-image
const uploadProjectImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const relativeUrl = `/uploads/projects/${req.file.filename}`;
    return res.json({
      success: true,
      message: 'Project image uploaded successfully!',
      image_url: relativeUrl,
      url: relativeUrl
    });
  } catch (err) {
    console.error('uploadProjectImage error:', err);
    return res.status(500).json({ success: false, message: 'Failed to upload project image.' });
  }
};

// POST /api/upload/certificate
const uploadCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No certificate document or image uploaded.' });
    }

    const relativeUrl = `/uploads/certificates/${req.file.filename}`;
    return res.json({
      success: true,
      message: 'Certificate document uploaded successfully!',
      url: relativeUrl,
      credential_url: relativeUrl,
      filename: req.file.originalname,
      original_name: req.file.originalname,
      file_size: req.file.size
    });
  } catch (err) {
    console.error('uploadCertificate error:', err);
    return res.status(500).json({ success: false, message: 'Failed to upload certificate document.' });
  }
};

module.exports = {
  uploadAvatar,
  uploadProjectImage,
  uploadCertificate,
  uploadResume,
  deleteResume,
  downloadResumeBySlug
};
