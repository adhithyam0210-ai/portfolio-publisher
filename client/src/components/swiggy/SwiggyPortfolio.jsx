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
  Shield,
  Layers,
  Terminal,
  Cpu
} from 'lucide-react';

export const SwiggyPortfolio = ({ data, theme, onToggleTheme, onNavigateUserLogin, onNavigateAdminLogin }) => {
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

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'react', label: 'React.js' },
    { id: 'node', label: 'Node.js & APIs' },
    { id: 'qa', label: 'QA & Testing' }
  ];

  const handleCopyEmail = async () => {
    const email = profile.email || 'adhithyam0210@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
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

  // Filter projects by category and search
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeCategory === 'all') return true;

    const tech = (p.technologies || '').toLowerCase();
    if (activeCategory === 'react') return tech.includes('react');
    if (activeCategory === 'node') return tech.includes('node') || tech.includes('express');
    if (activeCategory === 'qa') return tech.includes('jest') || tech.includes('test') || tech.includes('postman');
    if (activeCategory === 'fullstack') return tech.includes('react') && (tech.includes('node') || tech.includes('sql'));
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>

      {/* 1. Header (Swiggy / Zomato Alignment) */}
      <header className="site-header">
        <div className="container nav-wrap">
          <div className="brand-section">
            <a href="#top" className="brand-logo">
              <span>{profile.full_name ? profile.full_name.split(' ')[0].toUpperCase() : 'ADHITHYA'}</span>
            </a>
            <div className="location-pill" title="Current Location">
              <MapPin size={16} />
              <span>{profile.location || 'Chennai / Remote'}</span>
            </div>
          </div>

          <ul className="nav-links">
            <li className="nav-item"><a href="#education">Education</a></li>
            <li className="nav-item"><a href="#projects">Projects</a></li>
            <li className="nav-item"><a href="#skills">Skills</a></li>
            <li className="nav-item"><a href="#experience">Experience</a></li>
            <li className="nav-item"><a href="#contact">Contact</a></li>
          </ul>

          <div className="nav-actions">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="theme-btn"
              aria-label="Toggle Theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* User Login */}
            <button
              onClick={onNavigateUserLogin}
              className="btn-nav-auth btn-nav-user"
              title="User Login"
            >
              <User size={14} />
              <span>User Login</span>
            </button>

            {/* Admin Login */}
            <button
              onClick={onNavigateAdminLogin}
              className="btn-nav-auth btn-nav-admin"
              title="Admin Login"
            >
              <Shield size={14} />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero / About & Search Filter Section */}
      <section id="top" className="hero-banner">
        <div className="container hero-content">
          {/* Profile Avatar Display */}
          <div className="hero-avatar-wrap">
            {profile.profile_image ? (
              <img src={profile.profile_image} alt={profile.full_name} className="hero-avatar-img" />
            ) : (
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800 }}>
                {(profile.full_name || 'A').charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="hero-tagline">
            {profile.professional_title || 'Software Test Engineer & Full-Stack Developer'}
          </div>

          <h1 className="hero-title">
            Building reliable web apps &amp; scalable systems.
          </h1>

          <p className="hero-subtitle">
            {profile.about || 'Specializing in clean user interfaces, modern JavaScript/TypeScript architectures, automated QA frameworks, and high-performance backend services.'}
          </p>

          {/* Action Buttons Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', margin: '20px 0 28px' }}>
            <a href="#contact" className="btn-card btn-card-primary" style={{ padding: '10px 22px', fontSize: '0.92rem' }}>
              <Mail size={16} /> Contact Me
            </a>

            {resume && settings.resume_downloadable !== 0 && (
              <a href={resume.file_path} download className="btn-card btn-card-secondary" style={{ padding: '10px 20px', fontSize: '0.92rem' }}>
                <Download size={16} /> Download Resume
              </a>
            )}

            {profile.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="btn-card btn-card-secondary" style={{ padding: '10px 20px', fontSize: '0.92rem' }}>
                <Globe size={16} /> GitHub Profile
              </a>
            )}
          </div>

          {/* Swiggy Style Search Bar */}
          <div className="search-box-wrap">
            <Search size={18} className="search-icon-left" />
            <input
              type="text"
              className="search-input"
              placeholder="Search projects by title, tech stack, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="filter-pills-row">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Education Section */}
      <section id="education" className="section-wrapper" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-head-title">Academic Background &amp; Education</h2>
              <p className="section-head-desc">Formal degree qualifications, technical foundations, and specialized software testing coursework.</p>
            </div>
          </div>

          <div className="education-grid">
            {education.map((edu, idx) => (
              <div key={idx} className="edu-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                      {edu.degree}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {edu.institution}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {edu.start_year} — {edu.end_year || 'Present'} {edu.grade ? `• Grade: ${edu.grade}` : ''}
                    </div>
                  </div>
                </div>
                {edu.description && (
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '8px' }}>
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Projects Section (Swiggy / Zomato Card Grid) */}
      <section id="projects" className="section-wrapper">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-head-title">Featured Engineering Projects</h2>
              <p className="section-head-desc">Production-ready software architectures, automated testing suites, and scalable web solutions.</p>
            </div>
            <div className="results-count">{filteredProjects.length} Projects</div>
          </div>

          <div className="cards-grid">
            {filteredProjects.map((p, idx) => (
              <article key={idx} className="product-card">
                {/* 16:9 Card Banner */}
                <div className="card-banner-wrap">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <Code2 size={36} color="rgba(255,255,255,0.7)" />
                    <span style={{ fontSize: '0.78rem', letterSpacing: '0.05em', fontWeight: 600, color: '#fff' }}>
                      {p.title}
                    </span>
                  </div>
                  <span className="card-tag-badge">
                    {p.technologies?.split(',')[0] || 'ENGINEERING'}
                  </span>
                </div>

                <div className="card-body">
                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-summary">{p.description}</p>

                  {p.technologies && (
                    <div className="card-tech-chips">
                      {p.technologies.split(',').map((tech, tIdx) => (
                        <span key={tIdx} className="tech-chip">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="card-actions-bar">
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noreferrer" className="btn-card btn-card-primary">
                        <ExternalLink size={14} /> View Live Demo
                      </a>
                    )}
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noreferrer" className="btn-card btn-card-secondary">
                        <Globe size={14} /> Source Code
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Skills Section (Swiggy Food Menu Style) */}
      <section id="skills" className="section-wrapper" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-head-title">Technical Expertise &amp; Core Competencies</h2>
              <p className="section-head-desc">Industry-standard engineering frameworks, automated QA methodologies, and developer tooling.</p>
            </div>
          </div>

          <div className="skills-container-grid">
            {/* Category 1: QA & Testing */}
            <div className="skill-category-card">
              <div className="skill-category-header">
                <div className="skill-header-main">
                  <div className="skill-category-icon">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 className="skill-category-title">QA &amp; Testing</h3>
                </div>
              </div>
              <div className="skill-items-grid">
                {skills.filter(s => s.skill_name?.toLowerCase().includes('test') || s.skill_name?.toLowerCase().includes('stlc') || s.skill_name?.toLowerCase().includes('defect') || s.skill_name?.toLowerCase().includes('jira')).map((s, idx) => (
                  <div key={idx} className="skill-list-item">
                    <span>{s.skill_name}</span>
                    <span className="exp-score-pill">{s.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 2: Frontend Engineering */}
            <div className="skill-category-card">
              <div className="skill-category-header">
                <div className="skill-header-main">
                  <div className="skill-category-icon">
                    <Code2 size={20} />
                  </div>
                  <h3 className="skill-category-title">Frontend Engineering</h3>
                </div>
              </div>
              <div className="skill-items-grid">
                {skills.filter(s => s.skill_name?.toLowerCase().includes('react') || s.skill_name?.toLowerCase().includes('javascript') || s.skill_name?.toLowerCase().includes('html') || s.skill_name?.toLowerCase().includes('css') || s.skill_name?.toLowerCase().includes('ui')).map((s, idx) => (
                  <div key={idx} className="skill-list-item">
                    <span>{s.skill_name}</span>
                    <span className="exp-score-pill">{s.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 3: Backend, DB & Tooling */}
            <div className="skill-category-card">
              <div className="skill-category-header">
                <div className="skill-header-main">
                  <div className="skill-category-icon">
                    <Terminal size={20} />
                  </div>
                  <h3 className="skill-category-title">Backend, DB &amp; Tools</h3>
                </div>
              </div>
              <div className="skill-items-grid">
                {skills.filter(s => !s.skill_name?.toLowerCase().includes('test') && !s.skill_name?.toLowerCase().includes('stlc') && !s.skill_name?.toLowerCase().includes('defect') && !s.skill_name?.toLowerCase().includes('jira') && !s.skill_name?.toLowerCase().includes('react')).map((s, idx) => (
                  <div key={idx} className="skill-list-item">
                    <span>{s.skill_name}</span>
                    <span className="exp-score-pill">{s.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Experience Section */}
      <section id="experience" className="section-wrapper">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-head-title">Professional Experience</h2>
              <p className="section-head-desc">Career milestones, engineering deliverables, and quality assurance contributions.</p>
            </div>
          </div>

          <div className="timeline-card-list">
            {experience.map((exp, idx) => (
              <div key={idx} className="timeline-card">
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {exp.position}
                    </h3>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-primary)', background: 'var(--accent-tag-bg)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                      {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {exp.company} • Full-time
                  </div>
                  {exp.description && (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Contact Section */}
      <section id="contact" className="section-wrapper" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-head-title">Get in Touch</h2>
              <p className="section-head-desc">Have an open opportunity or a project in mind? Reach out directly.</p>
            </div>
          </div>

          <div className="contact-layout-grid">
            {/* Left: Info Card */}
            <div className="contact-info-panel">
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>Let's Connect</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                I am currently open to software testing, QA automation, and full-stack engineering roles. Reach out for collaboration or hiring.
              </p>

              {/* Direct Copy Email Card */}
              <div className="contact-direct-card" onClick={handleCopyEmail} title="Click to copy email address">
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {copiedEmail ? 'Copied to Clipboard!' : 'Email Address (Click to Copy)'}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {profile.email || 'adhithyam0210@gmail.com'}
                  </div>
                </div>
                {copiedEmail ? <Check size={18} color="#10b981" /> : <Copy size={18} color="var(--text-muted)" />}
              </div>

              {/* Social Links */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="btn-card btn-card-secondary" style={{ flex: 1 }}>
                    <Globe size={16} /> GitHub Profile
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-card btn-card-secondary" style={{ flex: 1 }}>
                    <Briefcase size={16} /> LinkedIn
                  </a>
                )}
              </div>
            </div>

            {/* Right: Message Form */}
            <div className="contact-info-panel">
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>Send a Direct Message</h3>

              {contactSent ? (
                <div style={{ padding: '20px', background: 'var(--accent-tag-bg)', borderRadius: 'var(--radius-md)', color: 'var(--accent-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={20} />
                  <span>Thank you! Your message has been sent successfully.</span>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Your Name</label>
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
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Email Address</label>
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
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Message</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Write your note or opportunity here..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-card btn-card-primary" style={{ width: 'fit-content', padding: '10px 24px' }}>
                    <Send size={15} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Swiggy / Zomato Clean Footer */}
      <footer className="site-footer">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            &copy; {new Date().getFullYear()} <strong>{profile.full_name || 'ADHITHYA'}</strong>. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={onNavigateUserLogin}
              style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              User Login
            </button>
            <span>•</span>
            <button
              onClick={onNavigateAdminLogin}
              style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Admin Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
