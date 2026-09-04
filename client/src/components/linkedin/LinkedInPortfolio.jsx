import React, { useState } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Download,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Search,
  CheckCircle2,
  Lock,
  Sun,
  Moon,
  Send,
  Share2,
  Copy,
  Check,
  Building2,
  Code2,
  FileText,
  User,
  Shield
} from 'lucide-react';

export const LinkedInPortfolio = ({ data, theme, onToggleTheme, onNavigateUserLogin, onNavigateAdminLogin }) => {
  const {
    profile = {},
    education = [],
    skills = [],
    projects = [],
    experience = [],
    certifications = [],
    achievements = [],
    resume = null,
    settings = {}
  } = data;

  const [copied, setCopied] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 4000);
  };

  const filteredProjects = projects.filter((p) =>
    !projectSearch ||
    p.title?.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.technologies?.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.description?.toLowerCase().includes(projectSearch.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', transition: 'background-color 0.2s ease' }}>

      {/* 1. Clean Top Navigation Bar (Zero In Symbol) */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.45rem 1rem'
      }}>
        <div style={{
          maxWidth: '1128px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          {/* Brand Logo (Personal Monogram, Zero In symbol) & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'var(--linkedin-blue)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem'
              }}>
                {(profile.full_name || 'A').charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                {profile.full_name ? profile.full_name.split(' ')[0].toUpperCase() : 'ADHITHYA'}<span style={{ color: 'var(--linkedin-blue)' }}>.</span>
              </span>
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '240px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.35rem 0.5rem 0.35rem 28px',
                  borderRadius: '4px',
                  background: 'var(--bg-subtle)',
                  border: 'none',
                  fontSize: '0.825rem',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Center Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="#about" style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              About
            </a>
            <a href="#experience" style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Experience
            </a>
            <a href="#projects" style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Projects
            </a>
            <a href="#skills" style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Skills
            </a>
            <a href="#contact" style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Contact
            </a>
          </div>

          {/* Right Action Bar: Theme Switch Button, User Login, Admin Login */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Theme Switch Button */}
            <button
              onClick={onToggleTheme}
              className="btn-linkedin-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            {/* User Login Link */}
            <button
              onClick={onNavigateUserLogin}
              className="btn-linkedin-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="User Login"
            >
              <User size={13} />
              <span>User Login</span>
            </button>

            {/* Admin Login Link */}
            <button
              onClick={onNavigateAdminLogin}
              className="btn-linkedin-outline"
              style={{
                fontSize: '0.8rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Admin Login"
            >
              <Shield size={13} />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Main Container (Two Columns: Profile Feed + Right Sidebar) */}
      <div className="linkedin-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Left Column (Main Feed Profile) */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Card 1: Profile Top Card with Banner & Avatar */}
          <div className="linkedin-card">
            {/* Banner Photo */}
            <div style={{
              height: '150px',
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 600 }}>
                PORTFOLIO
              </div>
            </div>

            <div style={{ padding: '0 1.5rem 1.5rem', position: 'relative' }}>
              {/* Overlapping Avatar Photo */}
              <div style={{
                position: 'relative',
                marginTop: '-60px',
                marginBottom: '0.75rem',
                display: 'inline-block'
              }}>
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={profile.full_name || 'Profile'}
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '4px solid var(--bg-card)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--linkedin-blue)',
                    color: '#ffffff',
                    border: '4px solid var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.75rem',
                    fontWeight: 700
                  }}>
                    {(profile.full_name || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name & Headline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {profile.full_name || 'Adhithya M'}
                </h1>
                <CheckCircle2 size={18} color="var(--linkedin-blue)" />
              </div>

              <div style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                {profile.professional_title || 'Software Test Engineer & Full-Stack Developer | SDLC, STLC & Automation | React & Node.js'}
              </div>

              {/* Location & Contact Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {profile.location && <span>{profile.location}</span>}
                <span>•</span>
                <a href="#contact" style={{ color: 'var(--linkedin-blue)', fontWeight: 600 }}>Contact info</a>
                <span>•</span>
                <span style={{ color: 'var(--linkedin-blue)', fontWeight: 600 }}>500+ connections</span>
              </div>

              {/* "Open to Work" Green Banner */}
              <div className="open-to-work-box">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--linkedin-green)', marginTop: '4px' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    Open to work
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    Software Test Engineer, QA Automation Engineer, and Full-Stack Developer roles
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <a href="#contact" className="btn-linkedin-primary">
                  <Mail size={16} /> Contact Me
                </a>

                {resume && settings.resume_downloadable !== 0 && (
                  <a href={resume.file_path} download className="btn-linkedin-outline">
                    <Download size={16} /> Download Resume
                  </a>
                )}

                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="btn-linkedin-secondary">
                    GitHub Profile
                  </a>
                )}

                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-linkedin-secondary">
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: About */}
          <div id="about" className="linkedin-card linkedin-card-padding">
            <h2 className="linkedin-title">About</h2>
            <p style={{ color: 'var(--text-main)', fontSize: '0.925rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {profile.about || profile.short_intro}
            </p>
          </div>

          {/* Card 3: Featured Projects */}
          <div id="projects" className="linkedin-card linkedin-card-padding">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="linkedin-title" style={{ margin: 0 }}>Featured Projects</h2>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{filteredProjects.length} items</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {filteredProjects.map((p, idx) => (
                <div key={idx} style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--bg-subtle)'
                }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem', flex: 1 }}>
                    {p.description}
                  </div>

                  {p.technologies && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
                      {p.technologies.split(',').map((tech, tIdx) => (
                        <span key={tIdx} style={{
                          fontSize: '0.725rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)'
                        }}>
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--linkedin-blue)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        Source Code
                      </a>
                    )}
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--linkedin-blue)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
                        <ExternalLink size={13} /> View Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Experience */}
          <div id="experience" className="linkedin-card linkedin-card-padding">
            <h2 className="linkedin-title">Experience</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', borderBottom: idx < experience.length - 1 ? '1px solid var(--border-subtle)' : 'none', paddingBottom: idx < experience.length - 1 ? '1.25rem' : '0' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <Building2 size={22} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>{exp.position}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{exp.company} • Full-time</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                    </div>
                    {exp.description && (
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                        {exp.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Skills */}
          <div id="skills" className="linkedin-card linkedin-card-padding">
            <h2 className="linkedin-title">Skills &amp; Endorsements</h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills.map((s, idx) => (
                <div key={idx} style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{s.skill_name}</span>
                  <span style={{ fontSize: '0.725rem', color: 'var(--linkedin-blue)', fontWeight: 700 }}>• {s.proficiency}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 6: Education */}
          <div id="education" className="linkedin-card linkedin-card-padding">
            <h2 className="linkedin-title">Education</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>{edu.institution}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{edu.degree}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {edu.start_year} — {edu.end_year || 'Present'} {edu.grade ? `• Grade: ${edu.grade}` : ''}
                    </div>
                    {edu.description && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                        {edu.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 7: Licenses & Certifications */}
          {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
            <div className="linkedin-card linkedin-card-padding">
              <h2 className="linkedin-title">Licenses &amp; Certifications</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {certifications.map((cert, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <Award size={20} color="var(--linkedin-blue)" style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{cert.name}</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{cert.issuer} • Issued {cert.issue_date}</div>
                      {cert.credential_url && (
                        <a href={cert.credential_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--linkedin-blue)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                          <ExternalLink size={12} /> Show credential
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {achievements.map((ach, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <CheckCircle2 size={18} color="var(--linkedin-green)" style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{ach.title}</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{ach.issuer} • {ach.date}</div>
                      {ach.description && <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{ach.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card 8: Interactive Contact Inquiry Form */}
          <div id="contact" className="linkedin-card linkedin-card-padding">
            <h2 className="linkedin-title">Send a Message</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Interested in collaborating, hiring, or discussing quality engineering and testing? Reach out directly.
            </p>

            {contactSent ? (
              <div style={{ padding: '1rem', background: 'var(--linkedin-green-light)', borderRadius: '6px', color: 'var(--linkedin-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <span>Thank you! Your message has been sent successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Sarah Jenkins"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. sarah@company.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Message</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Write your note or opportunity here..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn-linkedin-primary" style={{ width: 'fit-content' }}>
                  <Send size={15} /> Send Message
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

          {/* Sidebar Card 1: Public Profile Link */}
          <div className="linkedin-card linkedin-card-padding">
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Public Profile &amp; URL
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              {window.location.origin}/portfolio/{profile.username || 'adhithya'}
            </div>

            <button
              onClick={handleCopyLink}
              className="btn-linkedin-outline"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.825rem' }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Public Link'}</span>
            </button>
          </div>

          {/* Sidebar Card 2: Contact Details Summary */}
          <div className="linkedin-card linkedin-card-padding">
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
              Contact Information
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.825rem' }}>
              {profile.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} color="var(--text-muted)" />
                  <a href={`mailto:${profile.email}`} style={{ color: 'var(--linkedin-blue)' }}>{profile.email}</a>
                </div>
              )}

              {profile.github && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe size={14} color="var(--text-muted)" />
                  <a href={profile.github} target="_blank" rel="noreferrer" style={{ color: 'var(--linkedin-blue)' }}>GitHub Profile</a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Card 3: User & Admin Management Links */}
          <div className="linkedin-card linkedin-card-padding">
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.65rem', color: 'var(--text-main)' }}>
              Portals &amp; Logins
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={onNavigateUserLogin}
                className="btn-linkedin-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.825rem' }}
              >
                <User size={13} />
                <span>User Login (Edit Portfolio)</span>
              </button>

              <button
                onClick={onNavigateAdminLogin}
                className="btn-linkedin-outline"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.825rem' }}
              >
                <Shield size={13} />
                <span>Admin Login (Governance)</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <button onClick={onNavigateUserLogin} style={{ background: 'transparent', border: 'none', color: 'var(--linkedin-blue)', cursor: 'pointer', fontSize: '0.825rem', fontWeight: 600 }}>
            User Login
          </button>
          <span>•</span>
          <button onClick={onNavigateAdminLogin} style={{ background: 'transparent', border: 'none', color: 'var(--linkedin-blue)', cursor: 'pointer', fontSize: '0.825rem', fontWeight: 600 }}>
            Admin Login
          </button>
        </div>
        <div>&copy; {new Date().getFullYear()} {profile.full_name || 'Adhithya'}. All rights reserved.</div>
      </footer>
    </div>
  );
};
