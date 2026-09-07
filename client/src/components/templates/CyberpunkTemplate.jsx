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
  ExternalLink,
  Code2,
  Terminal,
  Cpu,
  Search,
  CheckCircle2,
  Award
} from 'lucide-react';
import { getGmailComposeUrl, getAssetUrl } from '../../utils/url';

export const CyberpunkTemplate = ({ data, theme = 'dark' }) => {
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

  const filteredProjects = projects.filter((p) => {
    return (
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className={`portfolio-view-root template-cyberpunk theme-${theme}`}>
      <div className="cyber-container">
        {/* Top HUD Line */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.78rem', color: '#06b6d4', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Terminal size={14} />
            <span>NODE_ID // {data.portfolio?.slug || 'USER'}.SYS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span>STATUS: ONLINE</span>
          </div>
        </div>

        {/* 1. Cyber Hero Card */}
        <div className="cyber-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {profile.profile_image ? (
              <img
                src={getAssetUrl(profile.profile_image)}
                alt={profile.full_name || 'Profile'}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '2px solid #06b6d4',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
                }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                color: '#07070b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 900
              }}>
                {(profile.full_name || 'U').charAt(0).toUpperCase()}
              </div>
            )}

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#06b6d4',
                  border: '1px solid rgba(6, 182, 212, 0.3)'
                }}>
                  {profile.availability_status || 'OPERATIONAL'}
                </span>
                {profile.location && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={12} /> {profile.location}
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 0.3rem' }}>
                {profile.full_name || 'System Operative'}
              </h1>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--user-accent, #06b6d4)', margin: '0 0 0.75rem', fontFamily: 'monospace' }}>
                &gt; {profile.professional_title || 'Software Architect'}
              </h2>
              {profile.short_intro && (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {profile.short_intro}
                </p>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="tm-actions-grid" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(6, 182, 212, 0.2)' }}>
            {settings.contact_visible !== 0 && settings.email_visible !== 0 && (profile.email || data.user?.email) && (
              <a
                href={getGmailComposeUrl(profile.email || data.user?.email, `Cyber Inquiry - ${profile.full_name || ''}`)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  background: 'var(--user-accent, #06b6d4)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
                }}
                title="Compose on Gmail"
              >
                <Mail size={15} /> Contact Me (Gmail)
              </a>
            )}

            {showSection('resume') && resume && settings.resume_downloadable !== 0 && (
              <a
                href={resumeUrl}
                download={resume.original_name || 'Resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  color: '#06b6d4',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  textDecoration: 'none'
                }}
              >
                <Download size={14} /> Download CV
              </a>
            )}

            {settings.contact_visible !== 0 && settings.phone_visible !== 0 && profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  textDecoration: 'none'
                }}
              >
                <Phone size={14} /> {profile.phone}
              </a>
            )}

            <div style={{ display: 'flex', gap: '0.4rem', marginLeft: 'auto' }}>
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="tm-social-icon-btn" style={{ borderRadius: '6px' }}>
                  <Github size={16} />
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="tm-social-icon-btn" style={{ borderRadius: '6px' }}>
                  <Linkedin size={16} />
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noreferrer" className="tm-social-icon-btn" style={{ borderRadius: '6px' }}>
                  <Twitter size={16} />
                </a>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" className="tm-social-icon-btn" style={{ borderRadius: '6px' }}>
                  <Globe size={16} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 2. Bio / Transmission */}
        {showSection('about') && profile.about && (
          <div className="cyber-card">
            <h3 style={{ fontSize: '1rem', fontFamily: 'monospace', color: '#06b6d4', textTransform: 'uppercase', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={16} /> BIO_PROFILE // TRANSMISSION
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0, whiteSpace: 'pre-line' }}>
              {profile.about}
            </p>
          </div>
        )}

        {/* 3. Featured Projects Showcase */}
        {showSection('projects') && projects.length > 0 && (
          <div className="cyber-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.2rem', fontFamily: 'monospace', color: '#06b6d4' }}>
                  DEPLOYED_SYSTEMS // PROJECTS ({projects.length})
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Engineered applications &amp; source modules</span>
              </div>

              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#06b6d4' }} />
                <input
                  type="text"
                  placeholder="Filter systems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '32px', height: '34px', fontSize: '0.82rem', borderRadius: '6px', border: '1px solid rgba(6,182,212,0.3)', background: 'rgba(0,0,0,0.3)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {filteredProjects.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'rgba(6, 182, 212, 0.03)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {p.image_url ? (
                    <img
                      src={getAssetUrl(p.image_url)}
                      alt={p.title}
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
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
                      display: p.image_url ? 'none' : 'flex',
                      height: '130px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(6,182,212,0.06)',
                      color: '#06b6d4'
                    }}
                  >
                    <Code2 size={36} />
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.4rem', color: 'var(--text-main)' }}>{p.title}</h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 1rem', flex: 1 }}>
                      {p.description}
                    </p>

                    {p.technologies && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                        {p.technologies.split(',').map((tech, tIdx) => (
                          <span key={tIdx} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(6,182,212,0.12)', color: '#06b6d4', fontFamily: 'monospace' }}>
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(6,182,212,0.15)' }}>
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: '0.76rem', borderRadius: '4px' }}>
                          <Github size={13} /> Source
                        </a>
                      )}
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: '0.76rem', borderRadius: '4px', background: 'var(--user-accent, #06b6d4)', color: '#ffffff' }}>
                          <ExternalLink size={13} /> Launch
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Skills Matrix (Neon Chip Cloud) */}
        {showSection('skills') && skills.length > 0 && (
          <div className="cyber-card">
            <h3 style={{ fontSize: '1rem', fontFamily: 'monospace', color: '#06b6d4', margin: '0 0 1rem', textTransform: 'uppercase' }}>
              TECH_CAPABILITIES // SKILLS_MATRIX
            </h3>

            <div className="tm-skills-cloud">
              {skills.map((s, idx) => (
                <div
                  key={idx}
                  className="tm-skill-chip"
                  style={{
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    background: 'rgba(6, 182, 212, 0.05)',
                    color: '#e2e8f0'
                  }}
                >
                  <span>{s.skill_name}</span>
                  {s.proficiency && (
                    <span style={{ fontSize: '0.68rem', color: '#06b6d4', fontWeight: 700 }}>
                      [{s.proficiency}]
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Certifications */}
        {showSection('certifications') && (certifications.length > 0 || achievements.length > 0) && (
          <div className="cyber-card">
            <h3 style={{ fontSize: '1rem', fontFamily: 'monospace', color: '#06b6d4', margin: '0 0 1rem', textTransform: 'uppercase' }}>
              VERIFIED_CREDENTIALS // HONORS
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.85rem' }}>
              {certifications.map((c, idx) => (
                <div key={`cert-${idx}`} style={{ padding: '0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(6,182,212,0.2)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.issuer}</div>
                </div>
              ))}

              {achievements.map((a, idx) => (
                <div key={`ach-${idx}`} style={{ padding: '0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f59e0b' }}>{a.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{a.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2.5rem' }}>
          CORE_ENGINE // PORTFOLIOCRAFT PLATFORM
        </footer>
      </div>
    </div>
  );
};
