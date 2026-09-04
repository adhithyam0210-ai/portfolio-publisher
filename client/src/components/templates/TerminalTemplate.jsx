import React from 'react';
import {
  Terminal,
  Code,
  FolderGit2,
  Cpu,
  Mail,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

export const TerminalTemplate = ({ data, theme = 'dark' }) => {
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
  const username = profile.username || (profile.full_name ? profile.full_name.toLowerCase().replace(/\s+/g, '-') : 'developer');

  return (
    <div className={`portfolio-view-root template-terminal theme-${theme}`}>
      <div className="terminal-container">
        {/* Terminal Window Header Bar */}
        <div className="terminal-top-bar">
          <div className="terminal-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="terminal-window-title">
            <Terminal size={14} />
            <span>bash — {username}@portfolio-os:~ (v2.4.0)</span>
          </div>
          <div style={{ width: '48px' }} />
        </div>

        {/* Terminal Body */}
        <div className="terminal-body">
          {/* Welcome Prompt */}
          <div className="terminal-line prompt-line">
            <span className="term-prompt">{username}@sys:~$</span>
            <span className="term-cmd">whoami --verbose</span>
          </div>

          {/* Hero Bio Banner */}
          <div className="terminal-hero-card">
            {profile.profile_image && (
              <img
                src={profile.profile_image}
                alt={profile.full_name}
                className="terminal-avatar"
              />
            )}
            <div className="terminal-hero-info">
              <div className="term-status-badge">
                <span className="pulse-indicator" /> SYSTEM_ONLINE // OPEN FOR OPPORTUNITIES
              </div>
              <h1 className="terminal-name">{profile.full_name || 'Developer'}</h1>
              <div className="terminal-role">&gt; {profile.professional_title || 'Software & Quality Systems Engineer'}</div>
              <p className="terminal-bio">
                {profile.short_intro || profile.about || 'Specialized in robust software development, automated testing, and scalable architecture.'}
              </p>

              <div className="terminal-meta-row">
                {profile.location && (
                  <span className="term-meta-item">
                    <MapPin size={13} /> {profile.location}
                  </span>
                )}
                {settings.email_visible !== 0 && profile.email && (
                  <a href={`mailto:${profile.email}`} className="term-meta-link">
                    <Mail size={13} /> {profile.email}
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="term-meta-link">
                    <Github size={13} /> GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="term-meta-link">
                    <Linkedin size={13} /> LinkedIn
                  </a>
                )}
                {settings.resume_downloadable !== 0 && resume && (
                  <a
                    href={resumeUrl}
                    download={resume.original_name || 'resume.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="term-resume-btn"
                    title={`Download ${resume.original_name || 'resume'}`}
                  >
                    <Download size={13} /> curl -O {resume.original_name || 'resume.pdf'}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          {showSection('about') && profile.about && (
            <div className="terminal-block">
              <div className="terminal-line prompt-line">
                <span className="term-prompt">{username}@sys:~$</span>
                <span className="term-cmd">cat ./about_me.txt</span>
              </div>
              <div className="terminal-output-box">
                <p>{profile.about}</p>
              </div>
            </div>
          )}

          {/* Skills Section */}
          {showSection('skills') && skills.length > 0 && (
            <div className="terminal-block">
              <div className="terminal-line prompt-line">
                <span className="term-prompt">{username}@sys:~$</span>
                <span className="term-cmd">pkg-config --list-skills</span>
              </div>
              <div className="terminal-skills-grid">
                {skills.map((s, idx) => (
                  <div key={idx} className="term-skill-chip">
                    <span className="term-skill-name">{s.skill_name}</span>
                    <span className="term-skill-level">[{s.proficiency || 'PRO'}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {showSection('projects') && projects.length > 0 && (
            <div className="terminal-block">
              <div className="terminal-line prompt-line">
                <span className="term-prompt">{username}@sys:~$</span>
                <span className="term-cmd">git log --projects --oneline</span>
              </div>
              <div className="terminal-projects-grid">
                {projects.map((proj, idx) => (
                  <div key={idx} className="terminal-project-box">
                    <div className="term-proj-header">
                      <div className="term-proj-title">
                        <FolderGit2 size={16} />
                        <span>{proj.title}</span>
                      </div>
                      <div className="term-proj-actions">
                        {proj.github_url && (
                          <a href={proj.github_url} target="_blank" rel="noreferrer" title="GitHub Repo">
                            <Github size={15} />
                          </a>
                        )}
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" rel="noreferrer" title="Live Deployment">
                            <ExternalLink size={15} />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="term-proj-desc">{proj.description}</p>
                    {proj.technologies && (
                      <div className="term-proj-tech">
                        {proj.technologies.split(',').map((t, i) => (
                          <span key={i} className="term-tech-tag">#{t.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience Section */}
          {showSection('experience') && experience.length > 0 && (
            <div className="terminal-block">
              <div className="terminal-line prompt-line">
                <span className="term-prompt">{username}@sys:~$</span>
                <span className="term-cmd">history | grep "work_experience"</span>
              </div>
              <div className="terminal-timeline">
                {experience.map((exp, idx) => (
                  <div key={idx} className="term-timeline-node">
                    <div className="term-timeline-marker">&gt;&gt;</div>
                    <div className="term-timeline-content">
                      <div className="term-exp-title">{exp.position} <span className="term-company">@{exp.company}</span></div>
                      <div className="term-exp-date">{exp.start_date} — {exp.is_current ? 'PRESENT (HEAD)' : exp.end_date}</div>
                      <p className="term-exp-desc">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {showSection('education') && education.length > 0 && (
            <div className="terminal-block">
              <div className="terminal-line prompt-line">
                <span className="term-prompt">{username}@sys:~$</span>
                <span className="term-cmd">cat /etc/credentials/degrees.log</span>
              </div>
              <div className="terminal-output-box">
                {education.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: idx < education.length - 1 ? '1rem' : 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--term-accent, #10b981)' }}>{edu.degree}</div>
                    <div style={{ opacity: 0.8, fontSize: '0.85rem' }}>{edu.institution} ({edu.start_year} - {edu.end_year || 'Present'})</div>
                    {edu.grade && <div style={{ fontSize: '0.82rem', opacity: 0.7 }}>Grade: {edu.grade}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terminal Footer Prompt */}
          <div className="terminal-line prompt-line" style={{ marginTop: '2rem' }}>
            <span className="term-prompt">{username}@sys:~$</span>
            <span className="cursor-blink">█</span>
          </div>
        </div>
      </div>
    </div>
  );
};
