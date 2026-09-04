import React, { useState } from 'react';
import {
  Mail,
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

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const showSection = (sec) => visibility[sec] !== false;
  const resumeUrl = resume
    ? (resume.download_url || resume.file_path || resume.file_url || (data.portfolio?.slug ? `/api/upload/resume/download/${data.portfolio.slug}` : ''))
    : '';

  // Filter projects by search and category
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      activeCategory === 'all' ||
      (p.technologies && p.technologies.toLowerCase().includes(activeCategory.toLowerCase()));

    return matchesSearch && matchesCat;
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
              <div className="tm-status-pill">
                <span className="status-dot" />
                <span>Available for Opportunities</span>
              </div>

              {profile.location && (
                <div className="location-pill">
                  <MapPin size={13} />
                  <span>{profile.location}</span>
                </div>
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
              {settings.email_visible !== 0 && profile.email && (
                <a href={`mailto:${profile.email}`} className="btn btn-primary btn-sm">
                  <Mail size={15} /> Contact Me
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
                >
                  <Download size={15} /> Download CV
                </a>
              )}

              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon-only btn-sm" title="GitHub">
                  <Github size={16} />
                </a>
              )}

              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon-only btn-sm" title="LinkedIn">
                  <Linkedin size={16} />
                </a>
              )}

              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon-only btn-sm" title="X / Twitter">
                  <Twitter size={16} />
                </a>
              )}

              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon-only btn-sm" title="Website">
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
          <section className="card">
            <div className="portfolio-section-head">
              <h3 className="portfolio-section-title">About & Professional Background</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
              {profile.about}
            </p>
          </section>
        )}

        {/* 3. Featured Projects with Search & Filters */}
        {showSection('projects') && projects.length > 0 && (
          <section>
            <div className="portfolio-section-head">
              <div>
                <h3 className="portfolio-section-title">Featured Projects</h3>
                <span className="portfolio-section-subtitle">Real-world systems, applications & tooling</span>
              </div>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                {filteredProjects.length} of {projects.length} displayed
              </span>
            </div>

            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['all', 'react', 'node', 'fullstack', 'api'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textTransform: 'capitalize', fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
                  >
                    {cat === 'all' ? 'All Projects' : cat}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter by tech or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '32px', height: '34px', fontSize: '0.825rem' }}
                />
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
                    <div style={{ display: 'flex', gap: '0.65rem', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.9rem' }}>
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
          <section className="card">
            <div className="portfolio-section-head">
              <h3 className="portfolio-section-title">Technical Proficiencies</h3>
              <span className="portfolio-section-subtitle">Core competencies & technologies</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {skills.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.45rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem'
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.skill_name}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    background: 'rgba(37, 99, 235, 0.12)',
                    color: 'var(--user-accent, var(--accent-primary))',
                    fontWeight: 700
                  }}>
                    {s.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Experience Timeline */}
        {showSection('experience') && experience.length > 0 && (
          <section>
            <div className="portfolio-section-head">
              <h3 className="portfolio-section-title">Professional Experience</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {experience.map((exp, idx) => (
                <div key={idx} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{exp.position}</h4>
                      <div style={{ fontSize: '0.95rem', color: 'var(--user-accent, var(--accent-primary))', fontWeight: 600 }}>
                        {exp.company}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-subtle)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                      <Calendar size={13} />
                      <span>{exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}</span>
                    </div>
                  </div>

                  {exp.description && (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Education */}
        {showSection('education') && education.length > 0 && (
          <section>
            <div className="portfolio-section-head">
              <h3 className="portfolio-section-title">Education & Academic Background</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {education.map((edu, idx) => (
                <div key={idx} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--user-accent, var(--accent-primary))' }}>
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{edu.degree}</h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{edu.field_of_study}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{edu.institution}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                    {edu.start_year} — {edu.end_year || 'Present'} {edu.grade ? `• Grade: ${edu.grade}` : ''}
                  </div>
                  {edu.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Certifications & Achievements */}
        {((showSection('certifications') && certifications.length > 0) || (showSection('achievements') && achievements.length > 0)) && (
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {showSection('certifications') && certifications.length > 0 && (
              <div className="card">
                <div className="portfolio-section-head" style={{ marginBottom: '1.25rem' }}>
                  <h3 className="portfolio-section-title" style={{ fontSize: '1.2rem' }}>Certifications</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {certifications.map((cert, idx) => (
                    <div key={idx} style={{ paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{cert.name}</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{cert.issuer} • {cert.issue_date}</div>
                      {cert.credential_url && (
                        <a href={cert.credential_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--user-accent, var(--accent-primary))', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
                          <ExternalLink size={12} /> Verify Credential
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showSection('achievements') && achievements.length > 0 && (
              <div className="card">
                <div className="portfolio-section-head" style={{ marginBottom: '1.25rem' }}>
                  <h3 className="portfolio-section-title" style={{ fontSize: '1.2rem' }}>Achievements & Honors</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {achievements.map((ach, idx) => (
                    <div key={idx} style={{ paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Award size={15} color="#f59e0b" />
                        <span>{ach.title}</span>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{ach.issuer} • {ach.date}</div>
                      {ach.description && <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{ach.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
