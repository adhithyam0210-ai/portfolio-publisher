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
  Sparkles,
  Award,
  Layers,
  Search
} from 'lucide-react';
import { getGmailComposeUrl, getAssetUrl } from '../../utils/url';

export const BentoTemplate = ({ data, theme = 'dark' }) => {
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
    <div className={`portfolio-view-root template-bento theme-${theme}`}>
      <div className="bento-container">
        <div className="bento-mosaic">
          {/* Bento Card 1: Main Hero (Span 8) */}
          <div className="bento-card bento-col-8" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
              {profile.profile_image ? (
                <img
                  src={getAssetUrl(profile.profile_image)}
                  alt={profile.full_name || 'Avatar'}
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '24px',
                    objectFit: 'cover',
                    border: '2px solid var(--primary, #6366f1)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '24px',
                  background: 'var(--primary, #6366f1)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 800
                }}>
                  {(profile.full_name || 'U').charAt(0).toUpperCase()}
                </div>
              )}

              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--primary, #6366f1)'
                  }}>
                    {profile.availability_status || 'Available'}
                  </span>
                  {profile.location && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={12} /> {profile.location}
                    </span>
                  )}
                </div>

                <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 0.35rem' }}>
                  {profile.full_name || 'Your Full Name'}
                </h1>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary, #6366f1)', margin: '0 0 0.85rem' }}>
                  {profile.professional_title || 'Software Specialist'}
                </h2>
                {profile.short_intro && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {profile.short_intro}
                  </p>
                )}
              </div>
            </div>

            {/* Actions Row */}
            <div className="tm-actions-grid" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {settings.contact_visible !== 0 && settings.email_visible !== 0 && (profile.email || data.user?.email) && (
                <a
                  href={getGmailComposeUrl(profile.email || data.user?.email, `Portfolio Inquiry - ${profile.full_name || ''}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tm-action-btn-primary"
                  title="Compose email on Gmail"
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
                  className="tm-action-btn-secondary"
                >
                  <Download size={14} /> Download CV
                </a>
              )}

              {settings.contact_visible !== 0 && settings.phone_visible !== 0 && profile.phone && (
                <a href={`tel:${profile.phone}`} className="tm-action-btn-secondary">
                  <Phone size={14} /> {profile.phone}
                </a>
              )}

              <div style={{ display: 'flex', gap: '0.4rem', marginLeft: 'auto' }}>
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="tm-social-icon-btn">
                    <Github size={16} />
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="tm-social-icon-btn">
                    <Linkedin size={16} />
                  </a>
                )}
                {profile.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noreferrer" className="tm-social-icon-btn">
                    <Twitter size={16} />
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noreferrer" className="tm-social-icon-btn">
                    <Globe size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bento Card 2: Quick Highlights / Skills (Span 4) */}
          <div className="bento-card bento-col-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Sparkles size={18} style={{ color: 'var(--primary, #6366f1)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Core Stack</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Top competencies & technical tools
              </p>

              <div className="tm-skills-cloud">
                {skills.slice(0, 10).map((s, idx) => (
                  <div key={idx} className="tm-skill-chip" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                    <span>{s.skill_name}</span>
                    {s.proficiency && (
                      <span className="tm-skill-badge" style={{ fontSize: '0.65rem' }}>{s.proficiency}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Total skills indexed: <strong style={{ color: 'var(--text-main)' }}>{skills.length}</strong>
            </div>
          </div>

          {/* Bento Card 3: About Me (Span 12 or 8) */}
          {showSection('about') && profile.about && (
            <div className="bento-card bento-col-12">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Layers size={18} style={{ color: 'var(--primary, #6366f1)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>About Me</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.94rem', margin: 0, whiteSpace: 'pre-line' }}>
                {profile.about}
              </p>
            </div>
          )}

          {/* Bento Card 4: Featured Projects Showcase (Span 12) */}
          {showSection('projects') && projects.length > 0 && (
            <div className="bento-card bento-col-12">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.25rem' }}>Featured Projects</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Interactive systems & live applications</span>
                </div>

                <div style={{ position: 'relative', minWidth: '220px' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '32px', height: '34px', fontSize: '0.82rem', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {filteredProjects.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.18s ease'
                    }}
                  >
                    {p.image_url ? (
                      <img
                        src={getAssetUrl(p.image_url)}
                        alt={p.title}
                        style={{ width: '100%', height: '160px', objectFit: 'cover' }}
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
                        height: '140px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(16,185,129,0.1))',
                        color: 'var(--primary, #6366f1)'
                      }}
                    >
                      <Code2 size={36} />
                    </div>

                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.4rem' }}>{p.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 1rem', flex: 1 }}>
                        {p.description}
                      </p>

                      {p.technologies && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                          {p.technologies.split(',').map((tech, tIdx) => (
                            <span key={tIdx} className="tech-tag" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {p.github_url && (
                          <a href={p.github_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: '0.78rem' }}>
                            <Github size={13} /> Code
                          </a>
                        )}
                        {p.live_url && (
                          <a href={p.live_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: '0.78rem' }}>
                            <ExternalLink size={13} /> Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bento Card 5: Certifications / Honors (Span 12) */}
          {showSection('certifications') && (certifications.length > 0 || achievements.length > 0) && (
            <div className="bento-card bento-col-12">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Award size={18} style={{ color: '#f59e0b' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Credentials &amp; Milestones</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {certifications.map((c, idx) => (
                  <div key={`cert-${idx}`} style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{c.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.issuer}</div>
                    {c.credential_url && (
                      <a href={c.credential_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'var(--primary, #6366f1)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.4rem' }}>
                        Verify <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                ))}

                {achievements.map((a, idx) => (
                  <div key={`ach-${idx}`} style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{a.title}</div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Published with <strong>PortfolioCraft</strong>
        </footer>
      </div>
    </div>
  );
};
