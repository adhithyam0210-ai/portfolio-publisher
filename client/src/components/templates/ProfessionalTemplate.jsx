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
  Briefcase,
  GraduationCap,
  Award,
  Code,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const ProfessionalTemplate = ({ data, theme = 'dark' }) => {
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
    <div className={`portfolio-view-root template-professional theme-${theme}`}>
      {/* Executive Hero */}
      <header className="tp-hero">
        <div className="tp-hero-content">
          {profile.profile_image ? (
            <img
              src={profile.profile_image}
              alt={profile.full_name || 'Profile'}
              className="tp-avatar"
            />
          ) : (
            <div className="tp-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b', fontSize: '3rem', fontWeight: 700 }}>
              {(profile.full_name || 'User').charAt(0)}
            </div>
          )}

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{profile.full_name || 'Your Full Name'}</h1>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--tp-accent)', fontWeight: 600, marginBottom: '0.75rem' }}>
              {profile.professional_title || 'Your Professional Title'}
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
              {settings.email_visible !== 0 && profile.email && (
                <a href={`mailto:${profile.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={16} /> {profile.email}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  <Linkedin size={15} /> LinkedIn
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  <Github size={15} /> GitHub
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  <Twitter size={15} /> X / Twitter
                </a>
              )}
              {showSection('resume') && resume && settings.resume_downloadable !== 0 && (
                <a
                  href={resumeUrl}
                  download={resume.original_name || 'Resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  title={`Download ${resume.original_name || 'Resume'}`}
                >
                  <Download size={15} /> Download Resume ({resume.original_name || 'PDF'})
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {/* About Me */}
        {showSection('about') && profile.about && (
          <section>
            <h3 className="portfolio-section-title">
              <Briefcase size={22} color="var(--tp-accent)" /> About Me
            </h3>
            <div className="tp-card" style={{ fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {profile.about}
            </div>
          </section>
        )}

        {/* Experience Timeline */}
        {showSection('experience') && experience.length > 0 && (
          <section>
            <h3 className="portfolio-section-title">
              <Briefcase size={22} color="var(--tp-accent)" /> Professional Experience
            </h3>
            <div className="tp-timeline">
              {experience.map((exp, idx) => (
                <div key={idx} className="tp-timeline-item">
                  <div className="tp-timeline-dot" />
                  <div className="tp-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{exp.position}</h4>
                      <span style={{ fontSize: '0.85rem', opacity: 0.75, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} /> {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                      </span>
                    </div>
                    <div style={{ fontSize: '1rem', color: 'var(--tp-accent)', fontWeight: 500, marginBottom: '0.75rem' }}>
                      {exp.company}
                    </div>
                    {exp.description && <p style={{ marginBottom: '0.75rem', opacity: 0.9 }}>{exp.description}</p>}
                    {exp.responsibilities && (
                      <p style={{ fontSize: '0.9rem', opacity: 0.8, fontStyle: 'italic' }}>
                        Key Impact: {exp.responsibilities}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {showSection('projects') && projects.length > 0 && (
          <section>
            <h3 className="portfolio-section-title">
              <Code size={22} color="var(--tp-accent)" /> Key Projects
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {projects.map((proj, idx) => (
                <div key={idx} className="tp-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  {proj.image_url && (
                    <img
                      src={proj.image_url}
                      alt={proj.title}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '1rem' }}
                    />
                  )}
                  <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{proj.title}</h4>
                  <p style={{ fontSize: '0.9rem', opacity: 0.85, flex: 1, marginBottom: '1rem' }}>{proj.description}</p>
                  {proj.technologies && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                      {proj.technologies.split(',').map((tech, tIdx) => (
                        <span key={tIdx} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                    {proj.github_url && (
                      <a href={proj.github_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                        <Github size={14} /> Repository
                      </a>
                    )}
                    {proj.live_url && (
                      <a href={proj.live_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                        <ExternalLink size={14} /> Live Preview
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
            <h3 className="portfolio-section-title">
              <CheckCircle2 size={22} color="var(--tp-accent)" /> Technical Proficiencies
            </h3>
            <div className="tp-card">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                {skills.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '0.4rem 0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.skill_name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--tp-accent)', opacity: 0.9 }}>
                      • {s.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Education & Certifications Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Education */}
          {showSection('education') && education.length > 0 && (
            <section>
              <h3 className="portfolio-section-title">
                <GraduationCap size={22} color="var(--tp-accent)" /> Education
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {education.map((edu, idx) => (
                  <div key={idx} className="tp-card">
                    <h4 style={{ fontSize: '1.1rem' }}>{edu.degree}</h4>
                    <div style={{ color: 'var(--tp-accent)', fontSize: '0.95rem', fontWeight: 500 }}>{edu.institution}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7, margin: '0.25rem 0' }}>
                      {edu.start_year} – {edu.end_year || 'Present'} {edu.grade ? `| ${edu.grade}` : ''}
                    </div>
                    {edu.description && <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.5rem' }}>{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications & Achievements */}
          {((showSection('certifications') && certifications.length > 0) || (showSection('achievements') && achievements.length > 0)) && (
            <section>
              <h3 className="portfolio-section-title">
                <Award size={22} color="var(--tp-accent)" /> Honors & Certifications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {certifications.map((c, idx) => (
                  <div key={`cert-${idx}`} className="tp-card">
                    <h4 style={{ fontSize: '1.05rem' }}>{c.name}</h4>
                    <div style={{ fontSize: '0.9rem', color: 'var(--tp-accent)' }}>{c.organization}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Issued: {c.issue_date}</div>
                  </div>
                ))}
                {achievements.map((a, idx) => (
                  <div key={`ach-${idx}`} className="tp-card">
                    <h4 style={{ fontSize: '1.05rem' }}>{a.title}</h4>
                    {a.description && <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.25rem' }}>{a.description}</p>}
                    {a.date && <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{a.date}</span>}
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
