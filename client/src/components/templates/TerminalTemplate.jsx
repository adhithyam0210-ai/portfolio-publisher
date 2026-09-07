import React from 'react';
import {
  Mail,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Download,
  Terminal,
  ExternalLink,
  Code2
} from 'lucide-react';
import { getGmailComposeUrl, getAssetUrl } from '../../utils/url';

export const TerminalTemplate = ({ data, theme = 'dark' }) => {
  const {
    profile = {},
    skills = [],
    projects = [],
    resume = null,
    settings = {},
    visibility = {}
  } = data;

  const showSection = (sec) => visibility[sec] !== false;
  const username = (data.portfolio?.slug || profile.full_name || 'developer').toLowerCase().replace(/\s+/g, '-');
  const resumeUrl = data.portfolio?.slug
    ? `/api/upload/resume/download/${data.portfolio.slug}`
    : (resume?.download_url || (resume?.file_path ? getAssetUrl(resume.file_path) : ''));

  return (
    <div className={`portfolio-view-root template-terminal theme-${theme}`}>
      <div className="terminal-container">
        {/* Terminal Header Bar */}
        <div className="terminal-bar">
          <div className="term-dots">
            <span className="term-dot dot-red" />
            <span className="term-dot dot-yellow" />
            <span className="term-dot dot-green" />
          </div>
          <div className="term-title">bash - {username}@portfolio-system: ~ (bash)</div>
        </div>

        {/* Terminal Body Screen */}
        <div className="terminal-body">
          {/* Identity Dump */}
          <div className="terminal-profile-block">
            {profile.profile_image && (
              <img
                src={getAssetUrl(profile.profile_image)}
                alt={profile.full_name}
                className="terminal-avatar"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <div className="terminal-profile-text">
              <h1 className="terminal-name">{profile.full_name || 'Anonymous Engineer'}</h1>
              <div className="terminal-role">&gt; {profile.professional_title || 'Software & Systems Engineer'}</div>
              <p className="terminal-bio">
                {profile.short_intro || profile.about || 'Specialized in robust software development, automated testing, and scalable architecture.'}
              </p>

              <div className="terminal-meta-row">
                {profile.location && (
                  <span className="term-meta-item">
                    <MapPin size={13} /> {profile.location}
                  </span>
                )}
                {settings.email_visible !== 0 && (profile.email || data.user?.email) && (
                  <a
                    href={getGmailComposeUrl(profile.email || data.user?.email, `Terminal Connect // ${profile.full_name || ''}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="term-meta-link"
                    title="Compose via Gmail"
                  >
                    <Mail size={13} /> Contact (Gmail)
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
              <div className="tm-skills-cloud" style={{ marginTop: '0.75rem' }}>
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.82rem',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#10b981',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '4px'
                    }}
                  >
                    ${s.skill_name} [{s.proficiency || 'PRO'}]
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {showSection('projects') && projects.length > 0 && (
            <div className="terminal-block">
              <div className="terminal-line prompt-line">
                <span className="term-prompt">{username}@sys:~$</span>
                <span className="term-cmd">ls -la ./repositories/</span>
              </div>
              <div className="term-proj-grid">
                {projects.map((proj, idx) => (
                  <div key={idx} className="term-proj-card">
                    <div className="term-proj-head">
                      <span className="term-proj-name">drwxr-xr-x {proj.title}</span>
                      <div className="term-proj-links">
                        {proj.github_url && (
                          <a href={proj.github_url} target="_blank" rel="noreferrer" title="Git Repo">
                            <Github size={14} />
                          </a>
                        )}
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" rel="noreferrer" title="Live Executable">
                            <ExternalLink size={14} />
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

          {/* Terminal Footer Prompt */}
          <div className="terminal-line prompt-line" style={{ marginTop: '2.5rem' }}>
            <span className="term-prompt">{username}@sys:~$</span>
            <span className="cursor-blink">█</span>
          </div>
        </div>
      </div>
    </div>
  );
};
