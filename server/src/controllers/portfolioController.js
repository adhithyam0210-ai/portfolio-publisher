const { dbRun, dbGet, dbAll } = require('../config/database');

// Helper to compute completion percentage
const computeCompletion = (data) => {
  let score = 0;
  // Personal profile info: up to 25 points
  if (data.profile) {
    if (data.profile.full_name) score += 5;
    if (data.profile.professional_title) score += 5;
    if (data.profile.short_intro) score += 5;
    if (data.profile.about) score += 5;
    if (data.profile.profile_image) score += 5;
  }
  // Education: 15 points
  if (data.education && data.education.length > 0) score += 15;
  // Skills: 15 points
  if (data.skills && data.skills.length > 0) score += 15;
  // Projects: 20 points
  if (data.projects && data.projects.length > 0) score += 20;
  // Experience: 15 points
  if (data.experience && data.experience.length > 0) score += 15;
  // Resume: 10 points
  if (data.resume) score += 10;

  return Math.min(100, score);
};

// GET /api/portfolio/me
const getMyPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await dbGet('SELECT id, username, email, role, status FROM users WHERE id = ?', [userId]);
    const profile = await dbGet('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    const portfolio = await dbGet('SELECT * FROM portfolios WHERE user_id = ?', [userId]);
    const settings = await dbGet('SELECT * FROM user_settings WHERE user_id = ?', [userId]);
    const education = await dbAll('SELECT * FROM education WHERE user_id = ? ORDER BY order_index ASC, id DESC', [userId]);
    const skills = await dbAll('SELECT * FROM skills WHERE user_id = ? ORDER BY order_index ASC, id ASC', [userId]);
    const projects = await dbAll('SELECT * FROM projects WHERE user_id = ? ORDER BY order_index ASC, id DESC', [userId]);
    const experience = await dbAll('SELECT * FROM experience WHERE user_id = ? ORDER BY order_index ASC, id DESC', [userId]);
    const certifications = await dbAll('SELECT * FROM certifications WHERE user_id = ? ORDER BY order_index ASC, id DESC', [userId]);
    const achievements = await dbAll('SELECT * FROM achievements WHERE user_id = ? ORDER BY order_index ASC, id DESC', [userId]);
    const resume = await dbGet('SELECT * FROM resumes WHERE user_id = ?', [userId]);

    let sectionVisibility = {
      about: true,
      skills: true,
      projects: true,
      experience: true,
      education: true,
      certifications: true,
      achievements: true,
      resume: true
    };

    if (portfolio && portfolio.section_visibility) {
      try {
        sectionVisibility = JSON.parse(portfolio.section_visibility);
      } catch (e) {}
    }

    let otherSocials = [];
    if (profile && profile.other_socials) {
      try {
        otherSocials = JSON.parse(profile.other_socials);
      } catch (e) {}
    }

    let enrichedResume = null;
    if (resume) {
      const downloadPath = (portfolio && portfolio.slug)
        ? `/api/upload/resume/download/${portfolio.slug}`
        : resume.file_path;
      enrichedResume = {
        ...resume,
        download_url: downloadPath,
        file_url: resume.file_path,
        file_path: resume.file_path
      };
    }

    const payload = {
      user,
      profile: { ...profile, email: profile?.email || user?.email, other_socials: otherSocials },
      portfolio: { ...portfolio, section_visibility: sectionVisibility },
      settings,
      education,
      skills,
      projects,
      experience,
      certifications,
      achievements,
      resume: enrichedResume
    };

    payload.completionPercentage = computeCompletion(payload);

    return res.json({ success: true, ...payload, data: payload });
  } catch (err) {
    console.error('getMyPortfolio error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve portfolio data.' });
  }
};

// PUT /api/portfolio/profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      full_name,
      professional_title,
      short_intro,
      about,
      location,
      phone,
      website,
      linkedin,
      github,
      twitter,
      other_socials,
      profile_image,
      availability_status,
      show_availability_badge,
      email
    } = req.body;

    const socialsStr = typeof other_socials === 'string' ? other_socials : JSON.stringify(other_socials || []);
    const statusText = availability_status !== undefined ? availability_status : 'Available for Opportunities';
    const showBadge = show_availability_badge !== undefined ? (show_availability_badge ? 1 : 0) : 1;

    await dbRun(`
      UPDATE profiles SET
        full_name = ?,
        professional_title = ?,
        short_intro = ?,
        about = ?,
        location = ?,
        phone = ?,
        website = ?,
        linkedin = ?,
        github = ?,
        twitter = ?,
        other_socials = ?,
        profile_image = COALESCE(?, profile_image),
        availability_status = ?,
        show_availability_badge = ?,
        email = COALESCE(?, email)
      WHERE user_id = ?
    `, [
      full_name || '',
      professional_title || '',
      short_intro || '',
      about || '',
      location || '',
      phone || '',
      website || '',
      linkedin || '',
      github || '',
      twitter || '',
      socialsStr,
      profile_image,
      statusText,
      showBadge,
      email !== undefined ? email : null,
      userId
    ]);

    const updatedProfile = await dbGet('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    const returnProfile = {
      ...updatedProfile,
      email: updatedProfile.email || req.user.email
    };
    return res.json({ success: true, message: 'Profile updated successfully!', profile: returnProfile });
  } catch (err) {
    console.error('updateProfile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

// PUT /api/portfolio/customization
const updateCustomization = async (req, res) => {
  try {
    const userId = req.user.id;
    const { template, theme, font_family, accent_color, layout_style, section_visibility } = req.body;

    const visibilityStr = section_visibility !== undefined
      ? (typeof section_visibility === 'string' ? section_visibility : JSON.stringify(section_visibility || {}))
      : null;

    await dbRun(`
      UPDATE portfolios SET
        template = COALESCE(?, template),
        theme = COALESCE(?, theme),
        font_family = COALESCE(?, font_family),
        accent_color = COALESCE(?, accent_color),
        layout_style = COALESCE(?, layout_style),
        section_visibility = COALESCE(?, section_visibility),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [
      template !== undefined ? template : null,
      theme !== undefined ? theme : null,
      font_family !== undefined ? font_family : null,
      accent_color !== undefined ? accent_color : null,
      layout_style !== undefined ? layout_style : null,
      visibilityStr,
      userId
    ]);

    const updated = await dbGet('SELECT * FROM portfolios WHERE user_id = ?', [userId]);
    return res.json({ success: true, message: 'Portfolio customization saved!', portfolio: updated });
  } catch (err) {
    console.error('updateCustomization error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update customization.' });
  }
};

// PUT /api/portfolio/settings
const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contact_visible, resume_downloadable, email_visible, phone_visible } = req.body;

    await dbRun(`
      UPDATE user_settings SET
        contact_visible = COALESCE(?, contact_visible),
        resume_downloadable = COALESCE(?, resume_downloadable),
        email_visible = COALESCE(?, email_visible),
        phone_visible = COALESCE(?, phone_visible)
      WHERE user_id = ?
    `, [
      contact_visible !== undefined ? (contact_visible ? 1 : 0) : null,
      resume_downloadable !== undefined ? (resume_downloadable ? 1 : 0) : null,
      email_visible !== undefined ? (email_visible ? 1 : 0) : null,
      phone_visible !== undefined ? (phone_visible ? 1 : 0) : null,
      userId
    ]);

    const updated = await dbGet('SELECT * FROM user_settings WHERE user_id = ?', [userId]);
    return res.json({ success: true, message: 'Settings updated successfully!', settings: updated });
  } catch (err) {
    console.error('updateSettings error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
};

// PUT /api/portfolio/slug
const updateSlug = async (req, res) => {
  try {
    const userId = req.user.id;
    const { slug } = req.body;

    if (!slug) {
      return res.status(400).json({ success: false, message: 'Slug is required.' });
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (cleanSlug.length < 3) {
      return res.status(400).json({ success: false, message: 'Slug must be at least 3 characters.' });
    }

    const existing = await dbGet('SELECT user_id FROM portfolios WHERE slug = ? AND user_id != ?', [cleanSlug, userId]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'This portfolio link is already claimed by another user.' });
    }

    await dbRun('UPDATE portfolios SET slug = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?', [cleanSlug, userId]);
    return res.json({ success: true, message: 'Portfolio link updated successfully!', slug: cleanSlug });
  } catch (err) {
    console.error('updateSlug error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update portfolio link.' });
  }
};

// POST /api/portfolio/publish
const publishPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    const portfolio = await dbGet('SELECT * FROM portfolios WHERE user_id = ?', [userId]);

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found.' });
    }

    await dbRun(`
      UPDATE portfolios SET 
        status = 'published', 
        published_at = CURRENT_TIMESTAMP, 
        updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = ?
    `, [userId]);

    return res.json({
      success: true,
      message: 'Portfolio published successfully! Anyone with your link can view it now.',
      status: 'published',
      slug: portfolio.slug
    });
  } catch (err) {
    console.error('publishPortfolio error:', err);
    return res.status(500).json({ success: false, message: 'Failed to publish portfolio.' });
  }
};

// POST /api/portfolio/unpublish
const unpublishPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    await dbRun(`
      UPDATE portfolios SET 
        status = 'unpublished', 
        updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = ?
    `, [userId]);

    return res.json({
      success: true,
      message: 'Portfolio unpublished. It is no longer accessible to the public.',
      status: 'unpublished'
    });
  } catch (err) {
    console.error('unpublishPortfolio error:', err);
    return res.status(500).json({ success: false, message: 'Failed to unpublish portfolio.' });
  }
};

// POST /api/portfolio/draft
const saveDraft = async (req, res) => {
  try {
    const userId = req.user.id;
    await dbRun(`
      UPDATE portfolios SET 
        status = 'draft', 
        updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = ?
    `, [userId]);

    return res.json({
      success: true,
      message: 'Portfolio saved as draft.',
      status: 'draft'
    });
  } catch (err) {
    console.error('saveDraft error:', err);
    return res.status(500).json({ success: false, message: 'Failed to save draft.' });
  }
};

// --- EDUCATION CRUD ---
const addEducation = async (req, res) => {
  try {
    const { degree, institution, start_year, end_year, grade, description } = req.body;
    if (!degree || !institution || !start_year) {
      return res.status(400).json({ success: false, message: 'Degree, institution, and start year are required.' });
    }

    const result = await dbRun(`
      INSERT INTO education (user_id, degree, institution, start_year, end_year, grade, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [req.user.id, degree, institution, start_year, end_year || '', grade || '', description || '']);

    const item = await dbGet('SELECT * FROM education WHERE id = ?', [result.lastID]);
    return res.status(201).json({ success: true, message: 'Education record added!', item, education: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add education record.' });
  }
};

const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { degree, institution, start_year, end_year, grade, description } = req.body;

    const existing = await dbGet('SELECT id FROM education WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Education record not found.' });

    await dbRun(`
      UPDATE education SET
        degree = ?, institution = ?, start_year = ?, end_year = ?, grade = ?, description = ?
      WHERE id = ? AND user_id = ?
    `, [degree, institution, start_year, end_year || '', grade || '', description || '', id, req.user.id]);

    const item = await dbGet('SELECT * FROM education WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Education updated!', item, education: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update education.' });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbRun('DELETE FROM education WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Record not found.' });
    return res.json({ success: true, message: 'Education deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete education.' });
  }
};

// --- SKILLS CRUD ---
const addSkill = async (req, res) => {
  try {
    const { skill_name, proficiency, category } = req.body;
    if (!skill_name) return res.status(400).json({ success: false, message: 'Skill name is required.' });

    const result = await dbRun(`
      INSERT INTO skills (user_id, skill_name, proficiency, category)
      VALUES (?, ?, ?, ?)
    `, [req.user.id, skill_name.trim(), proficiency || 'Intermediate', category || 'Technical']);

    const item = await dbGet('SELECT * FROM skills WHERE id = ?', [result.lastID]);
    return res.status(201).json({ success: true, message: 'Skill added!', item, skill: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add skill.' });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { skill_name, proficiency, category } = req.body;

    const existing = await dbGet('SELECT id FROM skills WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Skill not found.' });

    await dbRun(`
      UPDATE skills SET skill_name = ?, proficiency = ?, category = ?
      WHERE id = ? AND user_id = ?
    `, [skill_name, proficiency || 'Intermediate', category || 'Technical', id, req.user.id]);

    const item = await dbGet('SELECT * FROM skills WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Skill updated!', item, skill: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update skill.' });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbRun('DELETE FROM skills WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Skill not found.' });
    return res.json({ success: true, message: 'Skill deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete skill.' });
  }
};

// --- PROJECTS CRUD ---
const addProject = async (req, res) => {
  try {
    const { title, description, technologies, image_url, github_url, live_url, duration } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Project title and description are required.' });
    }

    const result = await dbRun(`
      INSERT INTO projects (user_id, title, description, technologies, image_url, github_url, live_url, duration)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [req.user.id, title, description, technologies || '', image_url || '', github_url || '', live_url || '', duration || '']);

    const item = await dbGet('SELECT * FROM projects WHERE id = ?', [result.lastID]);
    return res.status(201).json({ success: true, message: 'Project added!', item, project: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add project.' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, technologies, image_url, github_url, live_url, duration } = req.body;

    const existing = await dbGet('SELECT id FROM projects WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Project not found.' });

    await dbRun(`
      UPDATE projects SET
        title = ?, description = ?, technologies = ?, image_url = ?, github_url = ?, live_url = ?, duration = ?
      WHERE id = ? AND user_id = ?
    `, [title, description, technologies || '', image_url || '', github_url || '', live_url || '', duration || '', id, req.user.id]);

    const item = await dbGet('SELECT * FROM projects WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Project updated!', item, project: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update project.' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbRun('DELETE FROM projects WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.json({ success: true, message: 'Project deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
};

// --- EXPERIENCE CRUD ---
const addExperience = async (req, res) => {
  try {
    const { company, position, start_date, end_date, is_current, description, responsibilities } = req.body;
    if (!company || !position || !start_date) {
      return res.status(400).json({ success: false, message: 'Company, position, and start date are required.' });
    }

    const result = await dbRun(`
      INSERT INTO experience (user_id, company, position, start_date, end_date, is_current, description, responsibilities)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [req.user.id, company, position, start_date, end_date || '', is_current ? 1 : 0, description || '', responsibilities || '']);

    const item = await dbGet('SELECT * FROM experience WHERE id = ?', [result.lastID]);
    return res.status(201).json({ success: true, message: 'Experience added!', item, experience: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add experience.' });
  }
};

const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, position, start_date, end_date, is_current, description, responsibilities } = req.body;

    const existing = await dbGet('SELECT id FROM experience WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Experience not found.' });

    await dbRun(`
      UPDATE experience SET
        company = ?, position = ?, start_date = ?, end_date = ?, is_current = ?, description = ?, responsibilities = ?
      WHERE id = ? AND user_id = ?
    `, [company, position, start_date, end_date || '', is_current ? 1 : 0, description || '', responsibilities || '', id, req.user.id]);

    const item = await dbGet('SELECT * FROM experience WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Experience updated!', item, experience: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update experience.' });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbRun('DELETE FROM experience WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Experience not found.' });
    return res.json({ success: true, message: 'Experience deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete experience.' });
  }
};

// --- CERTIFICATIONS CRUD ---
const addCertification = async (req, res) => {
  try {
    const { name, organization, issue_date, credential_id, credential_url } = req.body;
    if (!name || !organization) {
      return res.status(400).json({ success: false, message: 'Certification name and organization are required.' });
    }

    const result = await dbRun(`
      INSERT INTO certifications (user_id, name, organization, issue_date, credential_id, credential_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [req.user.id, name, organization, issue_date || '', credential_id || '', credential_url || '']);

    const item = await dbGet('SELECT * FROM certifications WHERE id = ?', [result.lastID]);
    return res.status(201).json({ success: true, message: 'Certification added!', item, certification: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add certification.' });
  }
};

const updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, organization, issue_date, credential_id, credential_url } = req.body;

    const existing = await dbGet('SELECT id FROM certifications WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Certification not found.' });

    await dbRun(`
      UPDATE certifications SET
        name = ?, organization = ?, issue_date = ?, credential_id = ?, credential_url = ?
      WHERE id = ? AND user_id = ?
    `, [name, organization, issue_date || '', credential_id || '', credential_url || '', id, req.user.id]);

    const item = await dbGet('SELECT * FROM certifications WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Certification updated!', item, certification: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update certification.' });
  }
};

const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbRun('DELETE FROM certifications WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Certification not found.' });
    return res.json({ success: true, message: 'Certification deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete certification.' });
  }
};

// --- ACHIEVEMENTS CRUD ---
const addAchievement = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Achievement title is required.' });

    const result = await dbRun(`
      INSERT INTO achievements (user_id, title, description, date)
      VALUES (?, ?, ?, ?)
    `, [req.user.id, title, description || '', date || '']);

    const item = await dbGet('SELECT * FROM achievements WHERE id = ?', [result.lastID]);
    return res.status(201).json({ success: true, message: 'Achievement added!', item, achievement: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add achievement.' });
  }
};

const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;

    const existing = await dbGet('SELECT id FROM achievements WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Achievement not found.' });

    await dbRun(`
      UPDATE achievements SET title = ?, description = ?, date = ?
      WHERE id = ? AND user_id = ?
    `, [title, description || '', date || '', id, req.user.id]);

    const item = await dbGet('SELECT * FROM achievements WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Achievement updated!', item, achievement: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update achievement.' });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbRun('DELETE FROM achievements WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Achievement not found.' });
    return res.json({ success: true, message: 'Achievement deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete achievement.' });
  }
};

module.exports = {
  getMyPortfolio,
  updateProfile,
  updateCustomization,
  updateSettings,
  updateSlug,
  publishPortfolio,
  unpublishPortfolio,
  saveDraft,
  addEducation,
  updateEducation,
  deleteEducation,
  addSkill,
  updateSkill,
  deleteSkill,
  addProject,
  updateProject,
  deleteProject,
  addExperience,
  updateExperience,
  deleteExperience,
  addCertification,
  updateCertification,
  deleteCertification,
  addAchievement,
  updateAchievement,
  deleteAchievement
};
