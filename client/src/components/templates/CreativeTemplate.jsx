import React from 'react';
import {
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Download,
  Flame,
  Zap,
  ExternalLink,
  Code2
} from 'lucide-react';
import { getGmailComposeUrl, getAssetUrl } from '../../utils/url';

export const CreativeTemplate = ({ data, theme = 'dark' }) => {
  const {
    profile = {},
    skills = [],
    projects = [],
    resume = null,
    settings = {},
    visibility = {}
  } = data;

  const showSection = (sec) => visibility[sec] !== false;
  const resumeUrl = data.portfolio?.slug
    ? `/api/upload/resume/download/${data.portfolio.slug}`
    : (resume?.download_url || (resume?.file_path ? getAssetUrl(resume.file_path) : ''));

  return (
    <div className={`portfolio-view-root template-creative theme-${theme}`}>
      {/* Creative Splash Hero */}
      <header className="tc-hero">
        <div className="tc-hero-card">
          {profile.profile_image ? (
            <img
              src={getAssetUrl(profile.profile_image)}
              alt={profile.full_name}
              className="tc-avatar"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="tc-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#3b0764', fontSize: '3rem', fontWeight: 800, color: '#f472b6' }}>
              {(profile.full_name || 'C').charAt(0)}
            </div>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--tc-accent)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <Flame size={18} /> {profile.availability_status || 'Creative Full-Stack Visionary'}
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem' }}>
              {profile.full_name || 'Your Full Name'}
            </h1>
            <h2 style={{ fontSize: '1.3rem', color: '#cbd5e1', fontWeight: 500, marginBottom: '1rem' }}>
              {profile.professional_title || 'Designer & Engineer'}
            </h2>
            {profile.short_intro && (
              <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {profile.short_intro}
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {settings.email_visible !== 0 && (profile.email || data.user?.email) && (
                <a
                  href={getGmailComposeUrl(profile.email || data.user?.email, `Inquiry for ${profile.full_name || ''}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-md"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <Mail size={16} /> Contact Me (Gmail)
                </a>
              )}
              {showSection('resume') && resume && settings.resume_downloadable !== 0 && (
                <a
                  href={resumeUrl}
                  download={resume.original_name || 'Resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-md"
                  style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                  title={`Download ${resume.original_name || 'CV'}`}
                >
                  <Download size={16} /> Download CV
                </a>
              )}
              {settings.phone_visible !== 0 && profile.phone && (
                <a href={`tel:${profile.phone}`} className="btn btn-secondary btn-md" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Phone size={15} /> {profile.phone}
                </a>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" style={{ color: 'var(--tc-accent)' }}>
                  <Github size={20} />
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--tc-accent)' }}>
                  <Linkedin size={20} />
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noreferrer" style={{ color: 'var(--tc-accent)' }}>
                  <Twitter size={20} />
                </a>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" style={{ color: 'var(--tc-accent)' }}>
                  <Globe size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="portfolio-section" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        {/* About */}
        {showSection('about') && profile.about && (
          <section style={{ background: 'rgba(30, 27, 75, 0.4)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="portfolio-section-title" style={{ color: 'var(--tc-accent)', marginBottom: '1rem' }}>
              The Story So Far
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, opacity: 0.9, whiteSpace: 'pre-line' }}>
              {profile.about}
            </p>
          </section>
        )}

        {/* Featured Projects */}
        {showSection('projects') && projects.length > 0 && (
          <section>
            <h3 className="portfolio-section-title" style={{ color: 'var(--tc-accent)', marginBottom: '1.5rem' }}>
              Showcase Creations
            </h3>
            <div className="tc-project-grid">
              {projects.map((p, idx) => (
                <div key={idx} className="tc-project-card">
                  {p.image_url ? (
                    <img
                      src={getAssetUrl(p.image_url)}
                      alt={p.title}
                      className="tc-project-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className="tc-project-img"
                    style={{
                      display: p.image_url ? 'none' : 'flex',
                      height: '180px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: 'var(--tc-accent)'
                    }}
                  >
                    <Code2 size={40} />
                  </div>

                  <div className="tc-project-body">
                    <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{p.title}</h4>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {p.description}
                    </p>

                    {p.technologies && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                        {p.technologies.split(',').map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              background: 'rgba(236, 72, 153, 0.15)',
                              color: '#f472b6',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                          <Github size={14} /> Code
                        </a>
                      )}
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1, background: 'var(--tc-accent)' }}>
                          <ExternalLink size={14} /> Live
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {showSection('skills') && skills.length > 0 && (
          <section>
            <h3 className="portfolio-section-title" style={{ color: 'var(--tc-accent)' }}>
              <Zap size={22} /> Superpowers &amp; Toolkit
            </h3>
            <div className="tm-skills-cloud">
              {skills.map((s, idx) => (
                <div
                  key={idx}
                  className="tm-skill-chip"
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    padding: '0.5rem 1rem'
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{s.skill_name}</span>
                  {s.proficiency && (
                    <span style={{ fontSize: '0.72rem', background: 'var(--tc-accent)', color: '#fff', padding: '0.12rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                      {s.proficiency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '2.5rem 1.5rem', textAlign: 'center', opacity: 0.6, fontSize: '0.85rem' }}>
        Built with Creative Flair on <strong>PortfolioCraft</strong>
      </footer>
    </div>
  );
};
