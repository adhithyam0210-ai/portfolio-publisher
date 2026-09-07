import React, { useState } from 'react';
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
  Search,
  Code2,
  CheckCircle2
} from 'lucide-react';
import { getGmailComposeUrl, getAssetUrl } from '../../utils/url';

export const ModernTemplate = ({ data, theme = 'dark' }) => {
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

  const [searchQuery, setSearchQuery] = useState('');

  const showSection = (sec) => visibility[sec] !== false;

  const resumeUrl = data.portfolio?.slug
    ? `/api/upload/resume/download/${data.portfolio.slug}`
    : (resume?.download_url || (resume?.file_path ? getAssetUrl(resume.file_path) : ''));

  // Filter projects by search
  const filteredProjects = projects.filter((p) => {
    return (
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className={`portfolio-view-root template-modern theme-${theme}`}>
      {/* 1. Header / Hero Card */}
      <header className="tm-hero-wrap">
        <div className="tm-hero-card">
          {profile.profile_image ? (
            <img
              src={getAssetUrl(profile.profile_image)}
              alt={profile.full_name || 'Profile'}
              className="tm-avatar"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div
            className="tm-avatar"
            style={{
              display: profile.profile_image ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              background: 'var(--tp-subtle)'
            }}
          >
            {(profile.full_name || 'U').charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            {/* Status & Location Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
              {(profile.show_availability_badge !== false && profile.show_availability_badge !== 0) && (
                <div className="tm-status-pill">
                  <span className="status-dot" />
                  <span>{profile.availability_status || 'Available for Opportunities'}</span>
                </div>
              )}

              {profile.location && (
                <>
                  {(profile.show_availability_badge !== false && profile.show_availability_badge !== 0) && (
                    <span style={{ color: 'var(--tp-border, rgba(255,255,255,0.25))', fontSize: '0.85rem', userSelect: 'none' }}>|</span>
                  )}
                  <div className="location-pill">
                    <MapPin size={13} />
                    <span>{profile.location}</span>
                  </div>
                </>
              )}
            </div>

            {/* Name & Title */}
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.35rem' }}>
              {profile.full_name || 'Your Full Name'}
            </h1>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--user-accent, var(--accent-primary))', marginBottom: '0.85rem' }}>
              {profile.professional_title || 'Software Engineer & Technical Specialist'}
            </h2>

            {/* Short Intro */}
            {profile.short_intro && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '640px', marginBottom: '1.25rem' }}>
                {profile.short_intro}
              </p>
            )}

            {/* Unified Uniform Action Grid */}
            <div className="tm-actions-grid" style={{ marginTop: '0.85rem' }}>
              {settings.contact_visible !== 0 && settings.email_visible !== 0 && (profile.email || data.user?.email) && (
                <a
                  href={getGmailComposeUrl(
                    profile.email || data.user?.email,
                    `Portfolio Inquiry - ${profile.full_name || 'Connect'}`,
                    `Hi ${profile.full_name || ''},\n\nI saw your portfolio and would like to get in touch.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tm-action-btn-primary"
                  title="Compose direct email in Gmail"
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
                  className="tm-action-btn-secondary"
                  title={`Download ${resume.original_name || 'CV'}`}
                >
                  <Download size={15} /> Download CV
                </a>
              )}

              {settings.contact_visible !== 0 && settings.phone_visible !== 0 && profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="tm-action-btn-secondary"
                  title={`Call ${profile.phone}`}
                >
                  <Phone size={14} /> {profile.phone}
                </a>
              )}

              <div className="tm-social-group" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="tm-social-icon-btn" title="GitHub">
                    <Github size={17} />
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="tm-social-icon-btn" title="LinkedIn">
                    <Linkedin size={17} />
                  </a>
                )}
                {profile.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noreferrer" className="tm-social-icon-btn" title="X / Twitter">
                    <Twitter size={17} />
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noreferrer" className="tm-social-icon-btn" title="Website">
                    <Globe size={17} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="portfolio-section" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* 2. About Bio */}
        {showSection('about') && profile.about && (
          <section className="tm-card">
            <h3 className="portfolio-section-title" style={{ marginBottom: '0.75rem' }}>
              About &amp; Professional Background
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              {profile.about}
            </p>
          </section>
        )}

        {/* 3. Featured Projects with Search */}
        {showSection('projects') && projects.length > 0 && (
          <section>
            <div className="portfolio-section-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 className="portfolio-section-title">Featured Projects</h3>
                <span className="portfolio-section-subtitle">Real-world systems, applications &amp; tooling</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {filteredProjects.length} of {projects.length} displayed
                </span>
                <div style={{ position: 'relative', minWidth: '220px' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Filter projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '32px', height: '34px', fontSize: '0.825rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Project Cards Grid */}
            <div className="tm-project-grid">
              {filteredProjects.map((p, idx) => (
                <div key={idx} className="tm-project-card">
                  {p.image_url ? (
                    <img
                      src={getAssetUrl(p.image_url)}
                      alt={p.title}
                      className="tm-project-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className="tm-project-img"
                    style={{
                      display: p.image_url ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(16, 185, 129, 0.08))',
                      color: 'var(--user-accent, var(--primary))'
                    }}
                  >
                    <Code2 size={36} />
                  </div>

                  <div className="tm-project-body">
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{p.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                      {p.description}
                    </p>

                    {/* Tech Badges */}
                    {p.technologies && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                        {p.technologies.split(',').map((tech, tIdx) => (
                          <span key={tIdx} className="tech-tag">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    <div style={{ display: 'flex', gap: '0.65rem', marginTop: 'auto', borderTop: '1px solid var(--tp-border, var(--border-subtle))', paddingTop: '0.9rem' }}>
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                          <Github size={14} /> Code
                        </a>
                      )}
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                          <ExternalLink size={14} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Technical Proficiencies (Dynamic Wrapping Skills Cloud) */}
        {showSection('skills') && skills.length > 0 && (
          <section className="tm-card">
            <div className="portfolio-section-head">
              <div>
                <h3 className="portfolio-section-title">Technical Proficiencies</h3>
                <span className="portfolio-section-subtitle">Core competencies &amp; technologies</span>
              </div>
            </div>

            <div className="tm-skills-cloud" style={{ marginTop: '1.25rem' }}>
              {skills.map((s, idx) => (
                <div key={idx} className="tm-skill-chip">
                  <span style={{ color: 'var(--text-main)' }}>{s.skill_name}</span>
                  {s.proficiency && (
                    <span className="tm-skill-badge">
                      {s.proficiency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Certifications & Achievements */}
        {showSection('certifications') && (certifications.length > 0 || achievements.length > 0) && (
          <section className="tm-card">
            <div className="portfolio-section-head" style={{ marginBottom: '1.25rem' }}>
              <h3 className="portfolio-section-title">Credentials &amp; Recognitions</h3>
              <span className="portfolio-section-subtitle">Certificates, awards, and technical milestones</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {certifications.map((c, idx) => (
                <div key={`cert-${idx}`} style={{ padding: '1rem', background: 'var(--tp-subtle)', borderRadius: '10px', border: '1px solid var(--tp-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--user-accent, var(--primary))', flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{c.name}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {c.issuer} {c.issue_date ? `• ${c.issue_date}` : ''}
                  </div>
                  {c.credential_url && (
                    <a href={c.credential_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--user-accent, var(--primary))', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                      Verify Credential <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              ))}

              {achievements.map((a, idx) => (
                <div key={`ach-${idx}`} style={{ padding: '1rem', background: 'var(--tp-subtle)', borderRadius: '10px', border: '1px solid var(--tp-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <Award size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{a.title}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>
                    {a.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--tp-border, var(--border-subtle))', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div>
          Published with <strong style={{ color: 'var(--text-main)' }}>PortfolioCraft</strong>
        </div>
      </footer>
    </div>
  );
};
