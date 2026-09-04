import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Calendar,
  Download,
  Flame,
  Zap,
  Star,
  ExternalLink
} from 'lucide-react';

export const CreativeTemplate = ({ data, theme = 'dark' }) => {
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
    <div className={`portfolio-view-root template-creative theme-${theme}`}>
      {/* Creative Splash Hero */}
      <header className="tc-hero">
        <div className="tc-hero-card">
          {profile.profile_image ? (
            <img
              src={profile.profile_image}
              alt={profile.full_name}
              className="tc-avatar"
            />
          ) : (
            <div className="tc-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#3b0764', fontSize: '3rem', fontWeight: 800, color: '#f472b6' }}>
              {(profile.full_name || 'C').charAt(0)}
            </div>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--tc-accent)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <Flame size={18} /> Creative Full-Stack Visionary
            </div>
            <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem' }}>
              {profile.full_name || 'Your Full Name'}
            </h1>
            <h2 style={{ fontSize: '1.4rem', color: '#cbd5e1', fontWeight: 500, marginBottom: '1rem' }}>
              {profile.professional_title || 'Designer & Engineer'}
            </h2>
            {profile.short_intro && (
              <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {profile.short_intro}
              </p>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {showSection('resume') && resume && settings.resume_downloadable !== 0 && (
                <a
                  href={resumeUrl}
                  download={resume.original_name || 'Resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-md"
                  style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', border: 'none' }}
                  title={`Download ${resume.original_name || 'CV'}`}
                >
                  <Download size={18} /> Download CV
                </a>
              )}
              {settings.email_visible !== 0 && profile.email && (
                <a href={`mailto:${profile.email}`} className="btn btn-secondary btn-md">
                  <Mail size={18} /> Get In Touch
                </a>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.75rem' }}>
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

      {/* Main Sections */}
      <main className="portfolio-section" style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
        {/* About */}
        {showSection('about') && profile.about && (
          <section style={{ background: 'rgba(30, 27, 75, 0.4)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
            <h3 className="portfolio-section-title" style={{ color: 'var(--tc-accent)' }}>
              <Zap size={24} /> The Story & Philosophy
            </h3>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, opacity: 0.95, whiteSpace: 'pre-line' }}>
              {profile.about}
            </p>
          </section>
        )}

        {/* Projects */}
        {showSection('projects') && projects.length > 0 && (
          <section>
            <h3 className="portfolio-section-title" style={{ color: 'var(--tc-accent)' }}>
              <Star size={24} /> Selected Works
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {projects.map((p, idx) => (
                <div key={idx} className="tc-project-card">
                  {p.image_url && (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                    />
                  )}
                  <div style={{ padding: '1.75rem' }}>
                    <h4 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{p.title}</h4>
                    <p style={{ fontSize: '0.95rem', opacity: 0.85, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {p.description}
                    </p>
                    {p.technologies && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                        {p.technologies.split(',').map((t, i) => (
                          <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(236, 72, 153, 0.15)', color: 'var(--tc-accent)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                          <Github size={14} /> GitHub
                        </a>
                      )}
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1, background: 'var(--tc-accent)', border: 'none' }}>
                          <ExternalLink size={14} /> Launch
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
              <Zap size={24} /> Superpowers & Toolkit
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {skills.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '0.65rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{s.skill_name}</span>
                  <span style={{ fontSize: '0.75rem', background: 'var(--tc-accent)', color: '#fff', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 600 }}>
                    {s.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience & Education */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {showSection('experience') && experience.length > 0 && (
            <section>
              <h3 className="portfolio-section-title">Experience</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {experience.map((exp, idx) => (
                  <div key={idx} style={{ background: 'rgba(30, 27, 75, 0.3)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{exp.position}</h4>
                    <div style={{ color: 'var(--tc-accent)', fontWeight: 600 }}>{exp.company}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7, margin: '0.35rem 0' }}>{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</div>
                    {exp.description && <p style={{ fontSize: '0.9rem', opacity: 0.85, marginTop: '0.5rem' }}>{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {showSection('education') && education.length > 0 && (
            <section>
              <h3 className="portfolio-section-title">Education</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ background: 'rgba(30, 27, 75, 0.3)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{edu.degree}</h4>
                    <div style={{ color: 'var(--tc-accent)', fontWeight: 600 }}>{edu.institution}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7, margin: '0.35rem 0' }}>{edu.start_year} – {edu.end_year || 'Present'}</div>
                    {edu.description && <p style={{ fontSize: '0.9rem', opacity: 0.85, marginTop: '0.5rem' }}>{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};
