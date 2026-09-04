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

export const EditorialTemplate = ({ data, theme = 'light' }) => {
  const {
    profile = {},
    education = [],
    skills = [],
    projects = [],
    experience = [],
    certifications = [],
    achievements = [],
    resume = null,
    settings = {},
    visibility = {}
  } = data;

  const showSection = (sec) => visibility[sec] !== false;
  const resumeUrl = resume
    ? (resume.download_url || resume.file_path || resume.file_url || (data.portfolio?.slug ? `/api/upload/resume/download/${data.portfolio.slug}` : ''))
    : '';

  return (
    <div className={`portfolio-view-root template-editorial theme-${theme}`}>
      <div className="editorial-container">
        {/* Top Masthead */}
        <header className="editorial-masthead">
          <div className="masthead-meta">
            <span>VOLUME IV • ISSUE 2026</span>
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
                  <a href={`mailto:${profile.email}`} className="editorial-link">
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
                {settings.resume_downloadable !== 0 && resume && (
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
                  src={profile.profile_image}
                  alt={profile.full_name}
                  className="editorial-hero-image"
                />
                <div className="editorial-image-caption">
                  PORTRAIT // {profile.full_name?.toUpperCase() || 'AUTEUR'}
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
            <div className="editorial-skills-cloud">
              {skills.map((s, idx) => (
                <div key={idx} className="editorial-skill-tag">
                  <span className="skill-title">{s.skill_name}</span>
                  <span className="skill-dot">•</span>
                  <span className="skill-tier">{s.proficiency || 'Expert'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Chronology */}
        {showSection('experience') && experience.length > 0 && (
          <section className="editorial-section">
            <div className="editorial-section-header">
              <span className="editorial-num">04</span>
              <h3 className="editorial-section-title">Professional History</h3>
            </div>
            <div className="editorial-history-timeline">
              {experience.map((exp, idx) => (
                <div key={idx} className="editorial-history-item">
                  <div className="history-period">
                    {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                  </div>
                  <div className="history-details">
                    <h5 className="history-role">{exp.position}</h5>
                    <div className="history-company">{exp.company}</div>
                    <p className="history-desc">{exp.description}</p>
                  </div>
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
