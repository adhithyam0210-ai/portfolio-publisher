import React from 'react';
import {
  Mail,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Download,
  ExternalLink,
  Zap,
  Star,
  CheckCircle2,
  FolderKanban
} from 'lucide-react';
import { getGmailComposeUrl, getAssetUrl } from '../../utils/url';

export const BrutalistTemplate = ({ data, theme = 'light' }) => {
  const {
    profile = {},
    skills = [],
    projects = [],
    resume = null,
    settings = {},
    visibility = {}
  } = data;

  const showSection = (sec) => visibility[sec] !== false;
  const slug = data.portfolio?.slug || '';
  const resumeUrl = slug
    ? `/api/upload/resume/download/${slug}`
    : (resume?.download_url || resume?.file_path || resume?.file_url || '');

  return (
    <div className={`portfolio-view-root template-brutalist theme-${theme}`}>
      <div className="brutalist-wrap">
        {/* Marquee Top Tag */}
        <div className="brutalist-marquee-bar">
          <span>★ AVAILABLE FOR HIGH-IMPACT PROJECTS ★ FULL-STACK &amp; QUALITY ENGINEERING ★ ZERO DEFECT TOLERANCE ★</span>
        </div>

        {/* Hero Card */}
        <section className="brutalist-hero-box">
          <div className="brutalist-hero-left">
            <div className="brutalist-pill-sticker">
              <Zap size={14} /> CERTIFIED ENGINEER
            </div>
            <h1 className="brutalist-main-title">{profile.full_name || 'CREATIVE DEV'}</h1>
            <h2 className="brutalist-sub-title">{profile.professional_title || 'SOFTWARE ENGINEER'}</h2>
            <p className="brutalist-desc-box">
              {profile.short_intro || profile.about || 'Building resilient, fault-tolerant web applications with maximum user engagement and rock-solid quality assurance.'}
            </p>

            {/* Brutalist Button Links */}
            <div className="brutalist-btn-row">
              {settings.email_visible !== 0 && profile.email && (
                <a 
                  href={getGmailComposeUrl(profile.email, `Inquiry for ${profile.full_name || 'Engineer'}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutalist-btn bg-yellow"
                >
                  <Mail size={16} /> CONTACT ME (GMAIL)
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="brutalist-btn bg-white">
                  <Github size={16} /> GITHUB
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="brutalist-btn bg-blue">
                  <Linkedin size={16} /> LINKEDIN
                </a>
              )}
              {settings.resume_downloadable !== 0 && resume && resumeUrl && (
                <a
                  href={resumeUrl}
                  download={resume.original_name || 'RESUME.PDF'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutalist-btn bg-mint"
                  title={`Download ${resume.original_name || 'RESUME.PDF'}`}
                >
                  <Download size={16} /> {resume.original_name ? resume.original_name.toUpperCase() : 'DOWNLOAD CV'}
                </a>
              )}
            </div>
          </div>

          {profile.profile_image && (
            <div className="brutalist-avatar-frame">
              <img
                src={getAssetUrl(profile.profile_image)}
                alt={profile.full_name || 'Profile'}
                className="brutalist-avatar-img"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="avatar-sticker-badge">VERIFIED</div>
            </div>
          )}
        </section>

        {/* Skills Section */}
        {showSection('skills') && skills.length > 0 && (
          <section className="brutalist-card-section">
            <div className="brutalist-header-tab bg-mint">
              <Star size={18} /> SKILLS &amp; PROFICIENCIES
            </div>
            <div className="brutalist-skills-grid">
              {skills.map((s, idx) => (
                <div key={idx} className="brutalist-skill-block tm-skill-chip">
                  <span className="skill-name">{s.skill_name}</span>
                  <span className="skill-badge">{s.proficiency || 'EXPERT'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {showSection('projects') && projects.length > 0 && (
          <section className="brutalist-card-section">
            <div className="brutalist-header-tab bg-yellow">
              <FolderKanban size={18} /> FEATURED PROJECTS ({projects.length})
            </div>
            <div className="brutalist-projects-grid">
              {projects.map((proj, idx) => (
                <div key={idx} className="brutalist-project-card">
                  <div className="proj-tag-badge">PROJECT #{String(idx + 1).padStart(2, '0')}</div>
                  {proj.image_url && (
                    <div style={{ marginBottom: '14px', border: '3px solid #000', overflow: 'hidden', maxHeight: '180px' }}>
                      <img 
                        src={getAssetUrl(proj.image_url)} 
                        alt={proj.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <h3 className="proj-title">{proj.title}</h3>
                  <p className="proj-desc">{proj.description}</p>
                  {proj.technologies && (
                    <div className="proj-tech-row">
                      {proj.technologies.split(',').map((t, i) => (
                        <span key={i} className="proj-tech-badge">[{t.trim()}]</span>
                      ))}
                    </div>
                  )}
                  <div className="proj-action-bar">
                    {proj.live_url && (
                      <a href={proj.live_url} target="_blank" rel="noreferrer" className="brutalist-btn-sm bg-purple">
                        LIVE DEMO <ExternalLink size={13} />
                      </a>
                    )}
                    {proj.github_url && (
                      <a href={proj.github_url} target="_blank" rel="noreferrer" className="brutalist-btn-sm bg-white">
                        SOURCE <Github size={13} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="brutalist-footer-box">
          <div>© {new Date().getFullYear()} {profile.full_name?.toUpperCase() || 'DEVELOPER'} • PORTFOLIOCRAFT</div>
          <div className="footer-status-pill">ALL SYSTEMS OPERATIONAL</div>
        </footer>
      </div>
    </div>
  );
};
export default BrutalistTemplate;
