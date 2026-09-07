import React from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  Code2,
  Palette,
  Globe,
  QrCode,
  FileText,
  CheckCircle2,
  Share2,
  LogIn,
  UserPlus,
  Zap,
  Sliders,
  ExternalLink,
  Mail,
  Grid,
  Cpu
} from 'lucide-react';
import { getGmailComposeUrl } from '../utils/url';

export const HomePage = ({ onNavigate }) => {
  // Streamlined 4 Essential Core Pillars
  const coreFeatures = [
    {
      id: 'builder',
      title: 'Interactive Multi-Step Builder',
      badge: 'Core Engine',
      icon: <Code2 size={24} />,
      description:
        'Craft your developer profile, skills, projects, and bio in real-time with instant live preview before publishing.'
    },
    {
      id: 'templates',
      title: '8 Distinct Aesthetic Archetypes',
      badge: 'Design System',
      icon: <Palette size={24} />,
      description:
        'Choose from Bento Grid, Cyberpunk Neon, Modern Glass, Minimalist, Terminal, Editorial, and Neo-Brutalist layouts.'
    },
    {
      id: 'publishing',
      title: '1-Click Publishing & Custom Slug',
      badge: 'Instant Live',
      icon: <Globe size={24} />,
      description:
        'Deploy your portfolio to a clean personalized URL (e.g. /portfolio/:username) with dynamic high-resolution QR codes.'
    },
    {
      id: 'resume',
      title: 'ATS Resume Document Hosting',
      badge: 'Career Ready',
      icon: <FileText size={24} />,
      description:
        'Upload your PDF resume with direct one-click recruiter download, Gmail web compose contact, and privacy controls.'
    }
  ];

  // 8 Curated Templates showcase including the new Bento and Cyberpunk designs
  const templates = [
    {
      id: 'bento',
      name: 'Bento Grid',
      tagline: 'Modern modular Apple/Linear grid aesthetic',
      accent: '#6366f1',
      badge: 'Popular',
      features: ['Curated bento tiles', 'Fluid responsive grid', 'Micro-interactions']
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk HUD',
      tagline: 'Neon cyan & magenta high-tech terminal',
      accent: '#06b6d4',
      badge: 'Futuristic',
      features: ['Hacker HUD accents', 'Neon glow borders', 'Terminal console vibes']
    },
    {
      id: 'modern',
      name: 'Modern Glass',
      tagline: 'Glassmorphism cards & glowing gradients',
      accent: '#10b981',
      badge: 'Featured',
      features: ['Frosted glass cards', 'Vibrant emerald glow', 'Sleek lift animation']
    },
    {
      id: 'creative',
      name: 'Creative Flair',
      tagline: 'Warm gradients & asymmetric layouts',
      accent: '#ec4899',
      badge: 'Expressive',
      features: ['Playful card depths', 'Warm sunset tones', 'Dynamic pill badges']
    },
    {
      id: 'minimal',
      name: 'Swiss Minimalist',
      tagline: 'High-contrast monochrome typography',
      accent: '#64748b',
      badge: 'Clean',
      features: ['High readability', 'Sharp border accents', 'Generous whitespace']
    },
    {
      id: 'terminal',
      name: 'Developer Terminal',
      tagline: 'Monospace hacker console & bash prompt',
      accent: '#22c55e',
      badge: 'Geek',
      features: ['Bash command style', 'Matrix green syntax', 'Git branch logs']
    },
    {
      id: 'editorial',
      name: 'Vogue Editorial',
      tagline: 'Editorial monograph serif typography',
      accent: '#d97706',
      badge: 'Luxury',
      features: ['Playfair Display', 'Gold tone accents', 'Curated colophon']
    },
    {
      id: 'brutalist',
      name: 'Neo-Brutalism',
      tagline: 'Bold 3px solid borders & sticker tabs',
      accent: '#f59e0b',
      badge: 'Bold',
      features: ['Solid drop shadows', 'Vibrant pop colors', 'Marquee announcement']
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Create Account',
      desc: 'Sign up in seconds and claim your unique profile slug.'
    },
    {
      number: '2',
      title: 'Add Projects & Resume',
      desc: 'Add your live projects, technical skills, and upload your resume.'
    },
    {
      number: '3',
      title: 'Pick Template & Publish',
      desc: 'Select your preferred visual style and share your live portfolio link.'
    }
  ];

  return (
    <div className="landing-page-wrap">
      {/* ================= HERO SECTION ================= */}
      <section className="landing-hero">
        <div className="landing-pill-tag">
          <Sparkles size={16} />
          <span>The Next-Generation Portfolio Publisher</span>
        </div>

        <h1 className="landing-title">
          Build &amp; Publish Your{' '}
          <span className="landing-title-gradient">Standout Portfolio</span>
        </h1>

        <p className="landing-subtitle">
          Design a stunning developer portfolio with real-time live preview, 8 distinct aesthetic templates,
          dynamic QR codes, and ATS-ready resume hosting in minutes.
        </p>

        {/* Primary Action Buttons */}
        <div className="landing-hero-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('register')}
            style={{ fontSize: '1.02rem', padding: '0.85rem 1.85rem' }}
          >
            <UserPlus size={19} />
            <span>Create Free Portfolio</span>
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate('login')}
            style={{ fontSize: '1.02rem', padding: '0.85rem 1.85rem' }}
          >
            <LogIn size={19} />
            <span>Sign In</span>
          </button>

          <button
            className="btn btn-outline btn-lg"
            onClick={() => onNavigate('public', 'john-doe')}
            title="View sample live portfolio"
            style={{ fontSize: '1.02rem', padding: '0.85rem 1.5rem' }}
          >
            <ExternalLink size={17} />
            <span>Live Demo</span>
          </button>
        </div>

        {/* Highlight Metrics */}
        <div className="landing-metrics-bar">
          <div className="metric-item">
            <div className="metric-icon-wrap">
              <Palette size={20} />
            </div>
            <div>
              <div className="metric-value">8 Archetypes</div>
              <div className="metric-label">Custom Templates</div>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon-wrap">
              <Code2 size={20} />
            </div>
            <div>
              <div className="metric-value">Live Sync</div>
              <div className="metric-label">Real-Time Preview</div>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon-wrap">
              <QrCode size={20} />
            </div>
            <div>
              <div className="metric-value">Dynamic QR</div>
              <div className="metric-label">Instant Share</div>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon-wrap">
              <Globe size={20} />
            </div>
            <div>
              <div className="metric-value">1-Click Live</div>
              <div className="metric-label">Clean URL Slug</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ESSENTIAL CORE PILLARS ================= */}
      <section className="landing-section">
        <div className="section-header">
          <div className="section-tag">
            <Zap size={14} />
            <span>Essential Features</span>
          </div>
          <h2 className="section-title">Everything You Need to Stand Out</h2>
          <p className="section-desc">
            Focused, modern tools designed to present your professional journey with maximum visual impact.
          </p>
        </div>

        <div className="interactive-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {coreFeatures.map((feature) => (
            <div
              key={feature.id}
              className="feature-interactive-card"
              onClick={() => onNavigate('login')}
              title={`Click to get started with ${feature.title}`}
            >
              <div>
                <div className="card-top-row">
                  <div className="card-icon-box">{feature.icon}</div>
                  <span className="card-badge-pill">{feature.badge}</span>
                </div>
                <h3 className="card-feature-title">{feature.title}</h3>
                <p className="card-feature-desc">{feature.description}</p>
              </div>

              <div className="card-interactive-footer">
                <span>Try this feature</span>
                <ArrowRight size={15} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 8 DISTINCT TEMPLATES SECTION ================= */}
      <section className="landing-section" style={{ paddingTop: '1.5rem' }}>
        <div className="section-header">
          <div className="section-tag">
            <Palette size={14} />
            <span>Visual Themes</span>
          </div>
          <h2 className="section-title">8 Working Visual Templates</h2>
          <p className="section-desc">
            Tailor your portfolio's personality to match your craft. Click any card to preview in your account.
          </p>
        </div>

        <div className="templates-showcase-grid">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="template-card-preview"
              onClick={() => onNavigate('login')}
              title={`Click to use the ${tmpl.name} template`}
            >
              <div 
                className="template-visual-mock" 
                style={{ 
                  background: `linear-gradient(135deg, ${tmpl.accent}22, ${tmpl.accent}44)`,
                  border: `1px solid ${tmpl.accent}55`,
                  color: 'var(--text-main)'
                }}
              >
                <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>{tmpl.name}</span>
                <span style={{ fontSize: '0.74rem', opacity: 0.85, marginTop: '4px' }}>{tmpl.badge} Theme</span>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {tmpl.name}
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '38px' }}>
                {tmpl.tagline}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: 'auto', marginBottom: '1rem' }}>
                {tmpl.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <CheckCircle2 size={13} color="var(--accent-primary)" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="card-interactive-footer">
                <span>Select &amp; Apply</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS (3 STEPS) ================= */}
      <section className="landing-section" style={{ paddingTop: '1.5rem' }}>
        <div className="section-header">
          <div className="section-tag">
            <Sliders size={14} />
            <span>Workflow</span>
          </div>
          <h2 className="section-title">How It Works</h2>
          <p className="section-desc">
            Go live with your custom portfolio in 3 quick steps.
          </p>
        </div>

        <div className="how-it-works-grid">
          {steps.map((step) => (
            <div
              key={step.number}
              className="step-card"
              onClick={() => onNavigate('login')}
              style={{ cursor: 'pointer' }}
              title="Click to sign in and begin"
            >
              <div className="step-number-badge">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM CTA & GMAIL CONTACT ================= */}
      <section className="landing-section" style={{ paddingTop: '1rem', paddingBottom: '2.5rem' }}>
        <div className="landing-cta-banner">
          <h2 className="cta-banner-title">Ready to Publish Your Portfolio?</h2>
          <p className="cta-banner-desc">
            Create an account, pick from 8 handcrafted templates, and share your personalized link with the world.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('register')}
              style={{ padding: '0.85rem 2rem' }}
            >
              <UserPlus size={18} />
              <span>Get Started — Free</span>
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('login')}
              style={{ padding: '0.85rem 2rem' }}
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </button>
          </div>

          {/* Contact Support directly via Gmail Web Compose */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.84rem', opacity: 0.85, marginRight: '0.75rem' }}>
              Have questions or feedback?
            </span>
            <a
              href={getGmailComposeUrl('adhithyam0210@gmail.com', 'PortfolioCraft Inquiry & Feedback')}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.86rem',
                textDecoration: 'underline',
                background: 'rgba(255,255,255,0.12)',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                transition: 'background 0.15s ease'
              }}
            >
              <Mail size={15} />
              <span>Contact via Gmail</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
