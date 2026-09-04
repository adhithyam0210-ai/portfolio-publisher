import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Calendar,
  Download,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Search,
  CheckCircle2,
  Terminal,
  Code2
} from 'lucide-react';

export const ModernTemplate = ({ data, theme = 'dark' }) => {
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

  const [searchQuery, setSearchQuery] = useState('');

  const showSection = (sec) => visibility[sec] !== false;
  const resumeUrl = resume
    ? (resume.download_url || resume.file_path || resume.file_url || (data.portfolio?.slug ? `/api/upload/resume/download/${data.portfolio.slug}` : ''))
    : '';

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
      {/* 1. Header / Hero Card (Consumer-Tech Inspired) */}
      <header className="tm-hero-wrap">
        <div className="tm-hero-card">
          {profile.profile_image ? (
            <img
              src={profile.profile_image}
              alt={profile.full_name || 'Profile'}
              className="tm-avatar"
            />
          ) : (
            <div className="tm-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {(profile.full_name || 'U').charAt(0).toUpperCase()}
            </div>
          )}

          <div style={{ flex: 1, minWidth: '280px' }}>
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
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '640px', marginBottom: '1.35rem' }}>
                {profile.short_intro}
              </p>
            )}

            {/* Action Bar (Email, Resume, Socials) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {settings.contact_visible !== 0 && settings.email_visible !== 0 && (profile.email || data.user?.email) && (
                <a href={`mailto:${profile.email || data.user?.email}`} className="tm-contact-btn">
                  <Mail size={15} /> Contact Me
                </a>
              )}

              {settings.contact_visible !== 0 && settings.phone_visible !== 0 && profile.phone && (
                <a href={`tel:${profile.phone}`} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                  <Phone size={14} /> {profile.phone}
                </a>
              )}

              {showSection('resume') && resume && settings.resume_downloadable !== 0 && (
                <a
                  href={resumeUrl}
                  download={resume.original_name || 'Resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  title={`Download ${resume.original_name || 'CV'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.875rem' }}
                >
                  <Download size={15} /> Download CV
                </a>
              )}

              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon-only btn-sm" title="GitHub" style={{ borderRadius: '8px', width: '36px', height: '36px' }}>
                  <Github size={16} />
                </a>
              )}

              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon-only btn-sm" title="LinkedIn" style={{ borderRadius: '8px', width: '36px', height: '36px' }}>
                  <Linkedin size={16} />
                </a>
              )}

              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon-only btn-sm" title="X / Twitter" style={{ borderRadius: '8px', width: '36px', height: '36px' }}>
                  <Twitter size={16} />
                </a>
              )}

              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon-only btn-sm" title="Website" style={{ borderRadius: '8px', width: '36px', height: '36px' }}>
                  <Globe size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main style={{ maxWidth: '1060px', margin: '0 auto', padding: '0 1.5rem 5rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>

        {/* 2. About Me */}
        {showSection('about') && profile.about && (
          <section className="tm-card">
            <div className="portfolio-section-head" style={{ marginBottom: '1rem' }}>
              <h3 className="portfolio-section-title">About & Professional Background</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.75, whiteSpace: 'pre-line', margin: 0 }}>
              {profile.about}
            </p>
          </section>
        )}

        {/* 3. Featured Projects with Search */}
        {showSection('projects') && projects.length > 0 && (
          <section>
            <div className="portfolio-section-head" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h3 className="portfolio-section-title">Featured Projects</h3>
                <span className="portfolio-section-subtitle">Real-world systems, applications & tooling</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
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
                    <img src={p.image_url} alt={p.title} className="tm-project-img" />
                  ) : (
                    <div className="tm-project-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <Code2 size={32} />
                    </div>
                  )}

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

        {/* 4. Skills Matrix */}
        {showSection('skills') && skills.length > 0 && (
          <section className="tm-card">
            <div className="portfolio-section-head">
              <div>
                <h3 className="portfolio-section-title">Technical Proficiencies</h3>
                <span className="portfolio-section-subtitle">Core competencies & technologies</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
              {skills.map((s, idx) => (
                <div key={idx} className="tm-skill-pill">
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.skill_name}</span>
                  {s.proficiency && (
                    <span style={{
                      fontSize: '0.725rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      background: 'rgba(99, 102, 241, 0.12)',
                      color: 'var(--user-accent, var(--primary))',
                      fontWeight: 700,
                      letterSpacing: '0.02em'
                    }}>
                      {s.proficiency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Experience */}
        {showSection('experience') && experience.length > 0 && (
          <section>
            <div className="portfolio-section-head" style={{ marginBottom: '1.25rem' }}>
              <h3 className="portfolio-section-title">Professional Experience</h3>
              <span className="portfolio-section-subtitle">Career history, roles & key achievements</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {experience.map((exp, idx) => (
                <div key={idx} className="tm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem', lineHeight: 1.35 }}>
                      {exp.position}
                    </h4>
                    <div style={{ fontSize: '0.88rem', color: 'var(--user-accent, var(--accent-primary))', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span>{exp.company}</span>
                      {exp.location && (
                        <>
                          <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>•</span>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{exp.location}</span>
                        </>
                      )}
                    </div>

                    {exp.description && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.65rem', whiteSpace: 'pre-line' }}>
                        {exp.description}
                      </p>
                    )}

                    {exp.responsibilities && (
                      <div style={{ marginBottom: '0.65rem' }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>
                          Key Responsibilities &amp; Impact
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, background: 'var(--tp-subtle, var(--bg-subtle))', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--tp-border, var(--border-subtle))' }}>
                          {exp.responsibilities.split('\n').filter(Boolean).map((line, lIdx) => (
                            <div key={lIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', marginBottom: lIdx < exp.responsibilities.split('\n').filter(Boolean).length - 1 ? '0.3rem' : 0 }}>
                              <span style={{ color: 'var(--user-accent, var(--accent-primary))', fontWeight: 700 }}>•</span>
                              <span>{line.replace(/^[-•*]\s*/, '')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dotted separator as in second image */}
                  <div style={{ borderTop: '1px dashed var(--tp-border, var(--border-medium, #cbd5e1))', margin: '0.85rem 0 0.75rem' }} />

                  {/* Bottom badge / chips bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--tp-subtle, var(--bg-subtle))', padding: '0.22rem 0.65rem', borderRadius: '6px', fontWeight: 600 }}>
                      <Calendar size={12} />
                      <span>{exp.start_date} {exp.end_date || exp.is_current ? `— ${exp.is_current ? 'Present' : exp.end_date}` : ''}</span>
                    </div>

                    {exp.is_current ? (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                        Present
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Education */}
        {showSection('education') && education.length > 0 && (
          <section>
            <div className="portfolio-section-head" style={{ marginBottom: '1.25rem' }}>
              <h3 className="portfolio-section-title">Education & Academic Background</h3>
              <span className="portfolio-section-subtitle">Degrees, diplomas, coursework & qualifications</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {education.map((edu, idx) => (
                <div key={idx} className="tm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem', lineHeight: 1.35 }}>
                      {edu.degree}
                    </h4>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600 }}>{edu.institution}</span>
                      {(edu.location || edu.field_of_study) && (
                        <>
                          <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>•</span>
                          <span style={{ color: 'var(--text-muted)' }}>{edu.location || edu.field_of_study}</span>
                        </>
                      )}
                    </div>

                    {edu.description && (
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.5rem' }}>
                        {edu.description}
                      </p>
                    )}
                  </div>

                  {/* Dotted separator as in second image */}
                  <div style={{ borderTop: '1px dashed var(--tp-border, var(--border-medium, #cbd5e1))', margin: '0.85rem 0 0.75rem' }} />

                  {/* Bottom badge / chips bar (Image 2 style) */}
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--tp-subtle, var(--bg-subtle))', padding: '0.22rem 0.65rem', borderRadius: '6px', fontWeight: 600 }}>
                      {edu.start_year ? (edu.end_year ? `${edu.start_year} – ${edu.end_year}` : edu.start_year) : (edu.end_year || 'Present')}
                    </div>

                    {edu.grade && (
                      <div style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '0.22rem 0.65rem',
                        borderRadius: '6px',
                        background: 'rgba(245, 158, 11, 0.12)',
                        color: '#d97706',
                        border: '1px solid rgba(245, 158, 11, 0.25)'
                      }}>
                        {edu.grade.toLowerCase().includes('cgpa') || edu.grade.includes('%') || edu.grade.toLowerCase().includes('gpa')
                          ? edu.grade
                          : `${edu.grade} CGPA`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Certifications */}
        {showSection('certifications') && certifications.length > 0 && (
          <section>
            <div className="portfolio-section-head" style={{ marginBottom: '1.25rem' }}>
              <h3 className="portfolio-section-title">Certifications & Accreditations</h3>
              <span className="portfolio-section-subtitle">Verified professional credentials & courses</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {certifications.map((cert, idx) => (
                <div key={idx} className="tm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem', lineHeight: 1.35 }}>
                      {cert.name}
                    </h4>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600 }}>{cert.organization || cert.issuer}</span>
                      {cert.issue_date && (
                        <>
                          <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>•</span>
                          <span style={{ color: 'var(--text-muted)' }}>{cert.issue_date}</span>
                        </>
                      )}
                    </div>
                    {cert.credential_id && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Credential ID: <code style={{ fontSize: '0.75rem', background: 'var(--tp-subtle, var(--bg-subtle))', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{cert.credential_id}</code>
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px dashed var(--tp-border, var(--border-medium, #cbd5e1))', margin: '0.85rem 0 0.75rem' }} />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--tp-subtle, var(--bg-subtle))', padding: '0.22rem 0.65rem', borderRadius: '6px' }}>
                      {cert.issue_date || 'Certificate'}
                    </span>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--user-accent, var(--accent-primary))',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={12} /> Verify Credential
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Achievements */}
        {showSection('achievements') && achievements.length > 0 && (
          <section>
            <div className="portfolio-section-head" style={{ marginBottom: '1.25rem' }}>
              <h3 className="portfolio-section-title">Achievements & Honors</h3>
              <span className="portfolio-section-subtitle">Awards, recognitions & milestones</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {achievements.map((ach, idx) => (
                <div key={idx} className="tm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                      <Award size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, lineHeight: 1.35 }}>
                        {ach.title}
                      </h4>
                    </div>
                    {ach.issuer && (
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        {ach.issuer} {ach.date ? `• ${ach.date}` : ''}
                      </div>
                    )}
                    {ach.description && (
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                        {ach.description}
                      </p>
                    )}
                  </div>

                  <div style={{ borderTop: '1px dashed var(--tp-border, var(--border-medium, #cbd5e1))', margin: '0.85rem 0 0.75rem' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0.22rem 0.65rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.12)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                      Honor / Award
                    </span>
                    {ach.date && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--tp-subtle, var(--bg-subtle))', padding: '0.22rem 0.65rem', borderRadius: '6px', fontWeight: 600 }}>
                        {ach.date}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div>&copy; {new Date().getFullYear()} {profile.full_name || 'Portfolio'}. All rights reserved.</div>
      </footer>
    </div>
  );
};
