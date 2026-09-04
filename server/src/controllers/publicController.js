const { dbGet, dbAll } = require('../config/database');

// GET /api/public/portfolio/:slug
const getPublicPortfolio = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ success: false, message: 'Portfolio slug is required.' });
    }

    const cleanSlug = slug.trim().toLowerCase();
    const portfolio = await dbGet('SELECT * FROM portfolios WHERE slug = ?', [cleanSlug]);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        code: 'NOT_FOUND',
        message: 'No portfolio exists with this URL.'
      });
    }

    // Check if user is active
    const user = await dbGet('SELECT id, username, status FROM users WHERE id = ?', [portfolio.user_id]);
    if (!user || user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        code: 'USER_INACTIVE',
        message: 'This portfolio is unavailable because the account is currently inactive.'
      });
    }

    // Check publication status
    if (portfolio.status !== 'published') {
      return res.status(404).json({
        success: false,
        code: 'UNPUBLISHED',
        status: portfolio.status,
        message: 'This portfolio is currently in draft or has been unpublished by the author.'
      });
    }

    const userId = portfolio.user_id;

    // Fetch related records
    const profile = await dbGet('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    const settings = await dbGet('SELECT * FROM user_settings WHERE user_id = ?', [userId]) || {
      contact_visible: 1,
      resume_downloadable: 1,
      email_visible: 1,
      phone_visible: 0
    };

    const education = await dbAll('SELECT * FROM education WHERE user_id = ? ORDER BY order_index ASC, id DESC', [userId]);
    const skills = await dbAll('SELECT * FROM skills WHERE user_id = ? ORDER BY order_index ASC, id ASC', [userId]);
    const projects = await dbAll('SELECT * FROM projects WHERE user_id = ? ORDER BY order_index ASC, id DESC', [userId]);
    const experience = await dbAll('SELECT * FROM experience WHERE user_id = ? ORDER BY order_index ASC, id DESC', [userId]);
    const certifications = await dbAll('SELECT * FROM certifications WHERE user_id = ? ORDER BY order_index ASC, id DESC', [userId]);
    const achievements = await dbAll('SELECT * FROM achievements WHERE user_id = ? ORDER BY order_index ASC, id DESC', [userId]);
    const resumeRecord = await dbGet('SELECT id, file_path, original_name, file_size FROM resumes WHERE user_id = ?', [userId]);

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

    if (portfolio.section_visibility) {
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

    // Sanitize contact info according to privacy settings
    const sanitizedProfile = {
      full_name: profile ? profile.full_name : user.username,
      professional_title: profile ? profile.professional_title : '',
      short_intro: profile ? profile.short_intro : '',
      about: profile ? profile.about : '',
      location: profile ? profile.location : '',
      profile_image: profile ? profile.profile_image : '',
      website: profile ? profile.website : '',
      linkedin: profile ? profile.linkedin : '',
      github: profile ? profile.github : '',
      twitter: profile ? profile.twitter : '',
      other_socials: otherSocials,
      email: (settings.contact_visible && settings.email_visible && profile) ? profile.email : null,
      phone: (settings.contact_visible && settings.phone_visible && profile) ? profile.phone : null
    };

    // Sanitize resume according to privacy settings
    let sanitizedResume = null;
    if (resumeRecord && settings.resume_downloadable !== 0 && sectionVisibility.resume !== false) {
      const downloadPath = `/api/upload/resume/download/${portfolio.slug}`;
      sanitizedResume = {
        id: resumeRecord.id,
        original_name: resumeRecord.original_name,
        file_size: resumeRecord.file_size,
        file_path: downloadPath,
        file_url: downloadPath,
        download_url: downloadPath
      };
    }

    return res.json({
      success: true,
      portfolio: {
        slug: portfolio.slug,
        template: portfolio.template || 'modern',
        theme: portfolio.theme || 'dark',
        font_family: portfolio.font_family || 'Inter',
        accent_color: portfolio.accent_color || '#6366f1',
        layout_style: portfolio.layout_style || 'standard',
        published_at: portfolio.published_at,
        section_visibility: sectionVisibility
      },
      profile: sanitizedProfile,
      education: sectionVisibility.education ? education : [],
      skills: sectionVisibility.skills ? skills : [],
      projects: sectionVisibility.projects ? projects : [],
      experience: sectionVisibility.experience ? experience : [],
      certifications: sectionVisibility.certifications ? certifications : [],
      achievements: sectionVisibility.achievements ? achievements : [],
      resume: sanitizedResume,
      owner: {
        username: user.username
      }
    });
  } catch (err) {
    console.error('getPublicPortfolio error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving public portfolio.' });
  }
};

module.exports = {
  getPublicPortfolio
};
