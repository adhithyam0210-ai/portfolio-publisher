import React from 'react';
import {
  Mail,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Download,
  ExternalLink,
  Zap,
  Star,
  CheckCircle2,
  FolderKanban
} from 'lucide-react';

export const BrutalistTemplate = ({ data, theme = 'light' }) => {
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
    <div className={`portfolio-view-root template-brutalist theme-${theme}`}>
      <div className="brutalist-wrap">
        {/* Marquee Top Tag */}
        <div className="brutalist-marquee-bar">
          <span>★ AVAILABLE FOR HIGH-IMPACT PROJECTS ★ FULL-STACK &amp; QUALITY ENGINEERING ★ ZERO DEFECT TOLERANCE ★</span>
        </div>

        {/* Hero Card */}
        <section className="brutalist-hero-box">
          <div className="brutalist-hero-left">
            <div className="brutalist-pill-sticker">
              <Zap size={14} /> CERTIFIED ENGINEER
            </div>
            <h1 className="brutalist-main-title">{profile.full_name || 'CREATIVE DEV'}</h1>
            <h2 className="brutalist-sub-title">{profile.professional_title || 'SOFTWARE ENGINEER'}</h2>
            <p className="brutalist-desc-box">
              {profile.short_intro || profile.about || 'Building resilient, fault-tolerant web applications with maximum user engagement and rock-solid quality assurance.'}
            </p>

            {/* Brutalist Button Links */}
            <div className="brutalist-btn-row">
              {settings.email_visible !== 0 && profile.email && (
                <a href={`mailto:${profile.email}`} className="brutalist-btn bg-yellow">
                  <Mail size={16} /> CONTACT ME
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="brutalist-btn bg-white">
                  <Github size={16} /> GITHUB
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="brutalist-btn bg-blue">
                  <Linkedin size={16} /> LINKEDIN
                </a>
              )}
              {settings.resume_downloadable !== 0 && resume && (
                <a
                  href={resumeUrl}
                  download={resume.original_name || 'RESUME.PDF'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutalist-btn bg-mint"
                  title={`Download ${resume.original_name || 'RESUME.PDF'}`}
                >
                  <Download size={16} /> {resume.original_name ? resume.original_name.toUpperCase() : 'RESUME.PDF'}
                </a>
              )}
            </div>
          </div>

          {profile.profile_image && (
            <div className="brutalist-avatar-frame">
              <img
                src={profile.profile_image}
                alt={profile.full_name}
                className="brutalist-avatar-img"
              />
              <div className="avatar-sticker-badge">VERIFIED</div>
            </div>
          )}
        </section>

        {/* Skills Section */}
        {showSection('skills') && skills.length > 0 && (
          <section className="brutalist-card-section">
            <div className="brutalist-header-tab bg-mint">
              <Star size={18} /> SKILLS &amp; PROFICIENCIES
            </div>
            <div className="brutalist-skills-grid">
              {skills.map((s, idx) => (
                <div key={idx} className="brutalist-skill-block">
                  <span className="skill-name">{s.skill_name}</span>
                  <span className="skill-badge">{s.proficiency || 'EXPERT'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {showSection('projects') && projects.length > 0 && (
          <section className="brutalist-card-section">
            <div className="brutalist-header-tab bg-yellow">
              <FolderKanban size={18} /> FEATURED PROJECTS ({projects.length})
            </div>
            <div className="brutalist-projects-grid">
              {projects.map((proj, idx) => (
                <div key={idx} className="brutalist-project-card">
                  <div className="proj-tag-badge">PROJECT #{String(idx + 1).padStart(2, '0')}</div>
                  <h3 className="proj-title">{proj.title}</h3>
                  <p className="proj-desc">{proj.description}</p>
                  {proj.technologies && (
                    <div className="proj-tech-row">
                      {proj.technologies.split(',').map((t, i) => (
                        <span key={i} className="proj-tech-badge">[{t.trim()}]</span>
                      ))}
                    </div>
                  )}
                  <div className="proj-action-bar">
                    {proj.live_url && (
                      <a href={proj.live_url} target="_blank" rel="noreferrer" className="brutalist-btn-sm bg-purple">
                        LIVE DEMO <ExternalLink size={13} />
                      </a>
                    )}
                    {proj.github_url && (
                      <a href={proj.github_url} target="_blank" rel="noreferrer" className="brutalist-btn-sm bg-white">
                        SOURCE <Github size={13} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {showSection('experience') && experience.length > 0 && (
          <section className="brutalist-card-section">
            <div className="brutalist-header-tab bg-purple">
              CAREER CHRONOLOGY
            </div>
            <div className="brutalist-exp-stack">
              {experience.map((exp, idx) => (
                <div key={idx} className="brutalist-exp-item">
                  <div className="exp-left-bar">
                    <div className="exp-position">{exp.position}</div>
                    <div className="exp-company">@{exp.company}</div>
                    <div className="exp-period-pill">{exp.start_date} — {exp.is_current ? 'PRESENT' : exp.end_date}</div>
                  </div>
                  <div className="exp-right-content">
                    <p>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="brutalist-footer-box">
          <div>© {new Date().getFullYear()} {profile.full_name?.toUpperCase() || 'DEVELOPER'} • PORTFOLIOCRAFT</div>
          <div className="footer-status-pill">ALL SYSTEMS OPERATIONAL</div>
        </footer>
      </div>
    </div>
  );
};
