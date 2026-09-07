import React from 'react';
import {
  Mail,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Download,
  ArrowUpRight
} from 'lucide-react';
import { getGmailComposeUrl, getAssetUrl } from '../../utils/url';

export const MinimalTemplate = ({ data, theme = 'dark' }) => {
  const {
    profile = {},
    skills = [],
    projects = [],
    resume = null,
    settings = {},
    visibility = {}
  } = data;

  const showSection = (sec) => visibility[sec] !== false;
  const resumeUrl = data.portfolio?.slug
    ? `/api/upload/resume/download/${data.portfolio.slug}`
    : (resume?.download_url || (resume?.file_path ? getAssetUrl(resume.file_path) : ''));

  return (
    <div className={`portfolio-view-root template-minimal theme-${theme}`}>
      {/* Minimalist Swiss Hero */}
      <header className="tmin-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            {profile.profile_image && (
              <img
                src={getAssetUrl(profile.profile_image)}
                alt={profile.full_name}
                className="tmin-avatar"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <h1 style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              {profile.full_name || 'Your Full Name'}
            </h1>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 400, opacity: 0.75, marginTop: '0.5rem' }}>
              {profile.professional_title || 'Software Craftsman'}
            </h2>
            {profile.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', opacity: 0.6, marginTop: '0.5rem' }}>
                <MapPin size={14} /> {profile.location}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'flex-start' }}>
            {settings.email_visible !== 0 && (profile.email || data.user?.email) && (
              <a
                href={getGmailComposeUrl(profile.email || data.user?.email, `Portfolio Inquiry - ${profile.full_name || ''}`)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderBottom: '1px solid currentColor' }}
              >
                <Mail size={14} /> Contact via Gmail
              </a>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderBottom: '1px solid currentColor' }}>
                <Globe size={14} /> {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {showSection('resume') && resume && settings.resume_downloadable !== 0 && (
              <a
                href={resumeUrl}
                download={resume.original_name || 'Resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ marginTop: '0.5rem' }}
                title={`Download ${resume.original_name || 'Resume'}`}
              >
                <Download size={14} /> Download CV (PDF)
              </a>
            )}
          </div>
        </div>

        {profile.short_intro && (
          <p style={{ fontSize: '1.15rem', lineHeight: 1.7, marginTop: '2.5rem', maxWidth: '720px' }}>
            {profile.short_intro}
          </p>
        )}

        {/* Social Links */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
              <Github size={15} /> GitHub <ArrowUpRight size={12} />
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
              <Linkedin size={15} /> LinkedIn <ArrowUpRight size={12} />
            </a>
          )}
          {profile.twitter && (
            <a href={profile.twitter} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
              <Twitter size={15} /> Twitter <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </header>

      {/* About */}
      {showSection('about') && profile.about && (
        <section className="tmin-section">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', color: 'var(--tmin-accent)' }}>
            Background
          </h3>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, opacity: 0.85, maxWidth: '720px', whiteSpace: 'pre-line' }}>
            {profile.about}
          </p>
        </section>
      )}

      {/* Projects */}
      {showSection('projects') && projects.length > 0 && (
        <section className="tmin-section">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem', color: 'var(--tmin-accent)' }}>
            Selected Works
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {projects.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {p.title}
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noreferrer" style={{ color: 'var(--tmin-accent)' }}>
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </h4>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: '0.6rem 0 1rem', lineHeight: 1.6, flex: 1 }}>
                  {p.description}
                </p>
                {p.technologies && (
                  <div style={{ fontSize: '0.75rem', opacity: 0.6, fontFamily: 'monospace' }}>
                    {p.technologies}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {showSection('skills') && skills.length > 0 && (
        <section className="tmin-section">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem', color: 'var(--tmin-accent)' }}>
            Capabilities
          </h3>
          <div className="tm-skills-cloud">
            {skills.map((s, idx) => (
              <span key={idx} className="tm-skill-chip">
                {s.skill_name} <span style={{ opacity: 0.5 }}>/ {s.proficiency}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      <footer style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', opacity: 0.5 }}>
        Published with <strong>PortfolioCraft</strong>
      </footer>
    </div>
  );
};
