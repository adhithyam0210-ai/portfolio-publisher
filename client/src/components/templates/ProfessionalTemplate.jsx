import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Download,
  Award,
  ExternalLink,
  Code2,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { getGmailComposeUrl, getAssetUrl } from '../../utils/url';

export const ProfessionalTemplate = ({ data, theme = 'dark' }) => {
  const {
    profile = {},
    skills = [],
    projects = [],
    certifications = [],
    achievements = [],
    resume = null,
    settings = {},
    visibility = {}
  } = data;

  const showSection = (sec) => visibility[sec] !== false;
  const resumeUrl = data.portfolio?.slug
    ? `/api/upload/resume/download/${data.portfolio.slug}`
    : (resume?.download_url || (resume?.file_path ? getAssetUrl(resume.file_path) : ''));

  return (
    <div className={`portfolio-view-root template-professional theme-${theme}`}>
      {/* Executive Header */}
      <header className="tp-header">
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {profile.profile_image ? (
            <img
              src={getAssetUrl(profile.profile_image)}
              alt={profile.full_name}
              className="tp-avatar"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="tp-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--tp-subtle)', fontSize: '2.5rem', fontWeight: 800 }}>
              {(profile.full_name || 'E').charAt(0)}
            </div>
          )}

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
              {profile.full_name || 'Your Full Name'}
            </h1>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--tp-accent)', fontWeight: 600, marginBottom: '1rem' }}>
              {profile.professional_title || 'Executive Lead & Engineer'}
            </h2>
            {profile.short_intro && (
              <p style={{ fontSize: '1.05rem', opacity: 0.9, marginBottom: '1.25rem', maxWidth: '700px' }}>
                {profile.short_intro}
              </p>
            )}

            {/* Metadata Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', opacity: 0.85 }}>
              {profile.location && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={16} /> {profile.location}
                </span>
              )}
              {settings.email_visible !== 0 && (profile.email || data.user?.email) && (
                <a
                  href={getGmailComposeUrl(profile.email || data.user?.email, `Executive Inquiry - ${profile.full_name || ''}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Mail size={16} /> Contact Me (Gmail)
                </a>
              )}
              {settings.phone_visible === 1 && profile.phone && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={16} /> {profile.phone}
                </span>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Globe size={16} /> {profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>

            {/* Socials & Resume CTA */}
            <div className="tm-actions-grid" style={{ marginTop: '1.5rem' }}>
              {showSection('resume') && resume && settings.resume_downloadable !== 0 && (
                <a
                  href={resumeUrl}
                  download={resume.original_name || 'Resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tm-action-btn-primary"
                  title={`Download ${resume.original_name || 'Resume'}`}
                >
                  <Download size={15} /> Download CV ({resume.original_name || 'PDF'})
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="tm-action-btn-secondary">
                  <Linkedin size={15} /> LinkedIn
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="tm-action-btn-secondary">
                  <Github size={15} /> GitHub
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noreferrer" className="tm-action-btn-secondary">
                  <Twitter size={15} /> Twitter
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        {/* About Me */}
        {showSection('about') && profile.about && (
          <section>
            <h3 className="portfolio-section-title">
              <Briefcase size={22} color="var(--tp-accent)" /> Professional Overview
            </h3>
            <div className="tp-card" style={{ fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {profile.about}
            </div>
          </section>
        )}

        {/* Selected Projects */}
        {showSection('projects') && projects.length > 0 && (
          <section>
            <h3 className="portfolio-section-title">
              <Code2 size={22} color="var(--tp-accent)" /> Key Technical Initiatives
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {projects.map((proj, idx) => (
                <div key={idx} className="tp-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  {proj.image_url ? (
                    <img
                      src={getAssetUrl(proj.image_url)}
                      alt={proj.title}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.25rem' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      display: proj.image_url ? 'none' : 'flex',
                      height: '140px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--tp-subtle)',
                      borderRadius: '8px',
                      marginBottom: '1.25rem',
                      color: 'var(--tp-accent)'
                    }}
                  >
                    <Code2 size={36} />
                  </div>

                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{proj.title}</h4>
                  <p style={{ fontSize: '0.92rem', opacity: 0.85, lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                    {proj.description}
                  </p>
                  {proj.technologies && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                      {proj.technologies.split(',').map((tech, tIdx) => (
                        <span key={tIdx} style={{ fontSize: '0.75rem', background: 'var(--tp-subtle)', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid var(--tp-border)' }}>
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid var(--tp-border)', paddingTop: '1rem' }}>
                    {proj.github_url && (
                      <a href={proj.github_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                        <Github size={14} /> Repository
                      </a>
                    )}
                    {proj.live_url && (
                      <a href={proj.live_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                        <ExternalLink size={14} /> Enterprise Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {showSection('skills') && skills.length > 0 && (
          <section>
            <h3 className="portfolio-section-title">Core Competencies</h3>
            <div className="tm-skills-cloud">
              {skills.map((s, idx) => (
                <div key={idx} className="tm-skill-chip">
                  <span style={{ fontWeight: 600 }}>{s.skill_name}</span>
                  {s.proficiency && (
                    <span className="tm-skill-badge">{s.proficiency}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Credentials */}
        {showSection('certifications') && (certifications.length > 0 || achievements.length > 0) && (
          <section>
            <h3 className="portfolio-section-title">
              <Award size={22} color="var(--tp-accent)" /> Professional Credentials
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {certifications.map((c, idx) => (
                <div key={`cert-${idx}`} className="tp-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <CheckCircle2 size={16} color="var(--tp-accent)" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.name}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{c.issuer}</div>
                </div>
              ))}
              {achievements.map((a, idx) => (
                <div key={`ach-${idx}`} className="tp-card">
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>{a.title}</div>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0 }}>{a.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--tp-border)', padding: '2.5rem 1.5rem', textAlign: 'center', opacity: 0.6, fontSize: '0.85rem' }}>
        Corporate Showcase built with <strong>PortfolioCraft</strong>
      </footer>
    </div>
  );
};
