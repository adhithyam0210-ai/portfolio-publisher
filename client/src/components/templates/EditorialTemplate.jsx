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
  ArrowRight,
  Sparkles,
  Quote
} from 'lucide-react';
import { getGmailComposeUrl, getAssetUrl } from '../../utils/url';

export const EditorialTemplate = ({ data, theme = 'light' }) => {
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
    <div className={`portfolio-view-root template-editorial theme-${theme}`}>
      <div className="editorial-container">
        {/* Top Masthead */}
        <header className="editorial-masthead">
          <div className="masthead-meta">
            <span>VOLUME IV • ISSUE {new Date().getFullYear()}</span>
            <span>PORTFOLIO MONOGRAPH</span>
            <span>{profile.location || 'AVAILABLE INTERNATIONALLY'}</span>
          </div>
          <div className="masthead-divider" />
        </header>

        {/* Hero Spread */}
        <section className="editorial-hero">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-text">
              <span className="editorial-tagline">SELECTED WORKS &amp; PRACTICE</span>
              <h1 className="editorial-headline">{profile.full_name || 'Creative Practitioner'}</h1>
              <h2 className="editorial-subheadline">{profile.professional_title || 'Design Architect & Systems Engineer'}</h2>

              <div className="editorial-quote-block">
                <Quote size={20} className="editorial-quote-icon" />
                <p>{profile.short_intro || profile.about || 'A methodical approach to craftsmanship, digital aesthetics, and scalable engineering.'}</p>
              </div>

              <div className="editorial-contact-strip">
                {settings.email_visible !== 0 && profile.email && (
                  <a 
                    href={getGmailComposeUrl(profile.email, `Inquiry via Portfolio: ${profile.full_name || ''}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-link"
                  >
                    <Mail size={14} /> {profile.email}
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="editorial-link">
                    <Linkedin size={14} /> LinkedIn
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="editorial-link">
                    <Github size={14} /> GitHub
                  </a>
                )}
                {settings.resume_downloadable !== 0 && resume && resumeUrl && (
                  <a
                    href={resumeUrl}
                    download={resume.original_name || 'Resume.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-pill-btn"
                    title={`Download ${resume.original_name || 'Curated Résumé'}`}
                  >
                    <Download size={14} /> Curated Résumé
                  </a>
                )}
              </div>
            </div>

            {profile.profile_image && (
              <div className="editorial-hero-image-wrap">
                <img
                  src={getAssetUrl(profile.profile_image)}
                  alt={profile.full_name || 'Author portrait'}
                  className="editorial-hero-image"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="editorial-image-caption">
                  PORTRAIT // {profile.full_name?.toUpperCase() || 'PRACTITIONER'}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* About Essay */}
        {showSection('about') && profile.about && (
          <section className="editorial-section">
            <div className="editorial-section-header">
              <span className="editorial-num">01</span>
              <h3 className="editorial-section-title">Narrative &amp; Philosophy</h3>
            </div>
            <div className="editorial-body-columns">
              <p className="editorial-lead-para">{profile.about}</p>
            </div>
          </section>
        )}

        {/* Featured Projects Spread */}
        {showSection('projects') && projects.length > 0 && (
          <section className="editorial-section">
            <div className="editorial-section-header">
              <span className="editorial-num">02</span>
              <h3 className="editorial-section-title">Selected Projects</h3>
            </div>
            <div className="editorial-projects-list">
              {projects.map((proj, idx) => (
                <article key={idx} className="editorial-project-row">
                  <div className="editorial-proj-index">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="editorial-proj-main">
                    <h4 className="editorial-proj-title">{proj.title}</h4>
                    <p className="editorial-proj-desc">{proj.description}</p>
                    {proj.technologies && (
                      <div className="editorial-tech-list">
                        {proj.technologies.split(',').map((t, i) => (
                          <span key={i} className="editorial-tech-chip">{t.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="editorial-proj-links">
                    {proj.live_url && (
                      <a href={proj.live_url} target="_blank" rel="noreferrer" className="editorial-action-btn">
                        <span>View Project</span> <ArrowRight size={14} />
                      </a>
                    )}
                    {proj.github_url && (
                      <a href={proj.github_url} target="_blank" rel="noreferrer" className="editorial-code-link">
                        <Github size={14} /> Code
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Competencies & Skills */}
        {showSection('skills') && skills.length > 0 && (
          <section className="editorial-section">
            <div className="editorial-section-header">
              <span className="editorial-num">03</span>
              <h3 className="editorial-section-title">Core Competencies</h3>
            </div>
            <div className="editorial-skills-cloud tm-skills-cloud">
              {skills.map((s, idx) => (
                <div key={idx} className="editorial-skill-tag tm-skill-chip">
                  <span className="skill-title">{s.skill_name}</span>
                  <span className="skill-dot">•</span>
                  <span className="skill-tier">{s.proficiency || 'Proficient'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Colophon Footer */}
        <footer className="editorial-colophon">
          <div className="masthead-divider" />
          <div className="colophon-text">
            <span>© {new Date().getFullYear()} {profile.full_name || 'Portfolio'}. All rights reserved.</span>
            <span>TYPESET IN PLAYFAIR &amp; SANS-SERIF</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default EditorialTemplate;
