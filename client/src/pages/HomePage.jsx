import React from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  Code2,
  Palette,
  Globe,
  QrCode,
  FileText,
  Smartphone,
  Eye,
  CheckCircle2,
  Share2,
  Users,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Zap,
  Sliders,
  ExternalLink,
  Award
} from 'lucide-react';

export const HomePage = ({ onNavigate }) => {
  // Feature Cards displaying what the project is
  const projectFeatures = [
    {
      id: 'builder',
      title: 'Synchronized Multi-Step Builder',
      badge: 'Interactive Editor',
      icon: <Code2 size={24} />,
      description:
        'A comprehensive step-by-step manager for your Bio, Work Experience, Education, Skills with 4 proficiency tiers, Certifications, and GitHub projects with zero coding required.',
      actionHint: 'Click card to sign in & open builder'
    },
    {
      id: 'templates',
      title: '4 Designer Portfolio Archetypes',
      badge: 'Aesthetic Themes',
      icon: <Palette size={24} />,
      description:
        'Switch seamlessly between Modern Glassmorphism, Executive Timeline, Swiss Minimalist, and Creative Flair layouts with custom accent swatches and dark/light modes.',
      actionHint: 'Click card to sign in & customize styles'
    },
    {
      id: 'publishing',
      title: '1-Click Publishing & Custom Slug',
      badge: 'Live Deployment',
      icon: <Globe size={24} />,
      description:
        'Publish your portfolio instantly to a clean personalized URL (e.g. /portfolio/:username) with live status toggles between Published, Draft, and Unpublished modes.',
      actionHint: 'Click card to sign in & claim your slug'
    },
    {
      id: 'qrcode',
      title: 'Dynamic QR Code & Social Sharing',
      badge: 'Omnichannel Share',
      icon: <QrCode size={24} />,
      description:
        'Generate high-resolution canvas QR codes for your resume and business cards with PNG download support and 1-click sharing to WhatsApp, LinkedIn, X, and Email.',
      actionHint: 'Click card to sign in & generate QR code'
    },
    {
      id: 'resume',
      title: 'ATS Resume Document Manager',
      badge: 'Career Assets',
      icon: <FileText size={24} />,
      description:
        'Upload and host PDF or DOCX resumes (up to 10MB) with recruiter-friendly preview, direct download links, and replacement or deletion controls.',
      actionHint: 'Click card to sign in & upload resume'
    },
    {
      id: 'governance',
      title: 'Role-Based Platform Governance',
      badge: 'Admin Telemetry',
      icon: <Shield size={24} />,
      description:
        'Unified authentication with executive admin telemetry, user moderation, status activation/deactivation, administrative password resets, and portfolio audit trails.',
      actionHint: 'Click card to sign in & test governance'
    },
    {
      id: 'privacy',
      title: 'Granular Privacy & Recruiter Controls',
      badge: 'Data Security',
      icon: <Eye size={24} />,
      description:
        'Protect your personal contact info with fine-grained visibility controls to show or hide your email address, phone number, and resume download permissions.',
      actionHint: 'Click card to sign in & configure privacy'
    },
    {
      id: 'responsive',
      title: 'Multi-Device Viewport Switcher',
      badge: '100% Responsive',
      icon: <Smartphone size={24} />,
      description:
        'Live preview your portfolio across Desktop (100%), Tablet (768px), and Mobile (375px) in an isolated frame reflecting every edit before going public.',
      actionHint: 'Click card to sign in & test responsiveness'
    }
  ];

  // 7 Designer Templates preview
  const templates = [
    {
      id: 'modern',
      name: 'Modern Glass',
      tagline: 'Glassmorphism cards & glowing neon gradients',
      mockClass: 'mock-modern',
      features: ['Frosted glass backdrop', 'Glowing tech chips', 'Sleek lift cards']
    },
    {
      id: 'professional',
      name: 'Executive Timeline',
      tagline: 'Deep corporate palette & career milestones',
      mockClass: 'mock-professional',
      features: ['Structured milestones', 'Executive typography', 'Minimalist lines']
    },
    {
      id: 'minimal',
      name: 'Swiss Minimalist',
      tagline: 'High-contrast monochrome typography',
      mockClass: 'mock-minimal',
      features: ['Airy whitespace', 'Sharp borders', 'Editorial layout']
    },
    {
      id: 'creative',
      name: 'Creative Flair',
      tagline: 'Vibrant gradients & playful asymmetrical cards',
      mockClass: 'mock-creative',
      features: ['Warm accent gradients', 'Dynamic avatars', 'Interactive badges']
    },
    {
      id: 'terminal',
      name: 'Developer Terminal',
      tagline: 'Monospace hacker console & bash prompt',
      mockClass: 'mock-terminal',
      features: ['Bash command logs', 'Matrix green syntax', 'Git branch tags']
    },
    {
      id: 'editorial',
      name: 'Vogue Editorial',
      tagline: 'Editorial magazine serif typography',
      mockClass: 'mock-editorial',
      features: ['Playfair Display', 'Gold luxury accents', 'Asymmetric spreads']
    },
    {
      id: 'brutalist',
      name: 'Neo-Brutalism Pop',
      tagline: 'Bold 3px black borders & retro sticker badges',
      mockClass: 'mock-brutalist',
      features: ['Solid offset shadows', 'Pastel color blocks', 'Sticker badges']
    }
  ];

  // How it works steps
  const steps = [
    {
      number: '1',
      title: 'Create Your Account',
      desc: 'Sign up in under 30 seconds to claim your unique profile slug and access your unified dashboard.'
    },
    {
      number: '2',
      title: 'Add Details & Customize',
      desc: 'Fill in your projects, skills, work history, and choose from 4 designer templates with live preview.'
    },
    {
      number: '3',
      title: 'Publish & Share Worldwide',
      desc: 'Deploy with 1 click, print your dynamic QR code, and share your clean portfolio link with recruiters.'
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
          Build, Customize &amp; Publish Your{' '}
          <span className="landing-title-gradient">Standout Portfolio</span>
        </h1>

        <p className="landing-subtitle">
          An all-in-one developer and professional portfolio platform. Design your portfolio with real-time live preview,
          choose between 4 distinct aesthetic templates, generate dynamic QR codes, host ATS resumes, and manage everything with built-in role-based governance.
        </p>

        {/* Primary Action Buttons (Sign Up & Login) */}
        <div className="landing-hero-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('register')}
            style={{ fontSize: '1.05rem', padding: '0.85rem 1.85rem' }}
          >
            <UserPlus size={19} />
            <span>Create Free Portfolio (Sign Up)</span>
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate('login')}
            style={{ fontSize: '1.05rem', padding: '0.85rem 1.85rem' }}
          >
            <LogIn size={19} />
            <span>Sign In to Portal</span>
          </button>

          <button
            className="btn btn-outline btn-lg"
            onClick={() => onNavigate('public', 'john-doe')}
            title="View pre-published sample user portfolio"
            style={{ fontSize: '1.05rem', padding: '0.85rem 1.5rem' }}
          >
            <ExternalLink size={17} />
            <span>View Live Demo Portfolio</span>
          </button>
        </div>

        {/* Key Platform Highlights Bar */}
        <div className="landing-metrics-bar">
          <div className="metric-item">
            <div className="metric-icon-wrap">
              <Palette size={22} />
            </div>
            <div>
              <div className="metric-value">4 Archetypes</div>
              <div className="metric-label">Designer Templates</div>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon-wrap">
              <Code2 size={22} />
            </div>
            <div>
              <div className="metric-value">Live Sync</div>
              <div className="metric-label">Real-Time Split Preview</div>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon-wrap">
              <QrCode size={22} />
            </div>
            <div>
              <div className="metric-value">Dynamic QR</div>
              <div className="metric-label">1-Click Omnichannel Share</div>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon-wrap">
              <Shield size={22} />
            </div>
            <div>
              <div className="metric-value">RBAC Security</div>
              <div className="metric-label">Admin &amp; User Portals</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PLATFORM CAPABILITIES (CARDS STRUCTURE) ================= */}
      <section className="landing-section">
        <div className="section-header">
          <div className="section-tag">
            <Zap size={14} />
            <span>Project Capabilities</span>
          </div>
          <h2 className="section-title">Everything Built into PortfolioCraft</h2>
          <p className="section-desc">
            Explore what the project does in the interactive cards below. <strong>Click any card to go to the login page</strong> and test the features firsthand.
          </p>
        </div>

        {/* The Cards Grid - Clicking redirects to login page as requested */}
        <div className="interactive-cards-grid">
          {projectFeatures.map((feature) => (
            <div
              key={feature.id}
              className="feature-interactive-card"
              onClick={() => onNavigate('login')}
              title={`Click to sign in and test ${feature.title}`}
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
                <span>{feature.actionHint}</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 4 DESIGNER TEMPLATES SECTION ================= */}
      <section className="landing-section" style={{ paddingTop: '1rem' }}>
        <div className="section-header">
          <div className="section-tag">
            <Palette size={14} />
            <span>Showcase Aesthetics</span>
          </div>
          <h2 className="section-title">4 Distinct Template Archetypes</h2>
          <p className="section-desc">
            Crafted for developers, designers, and corporate executives. Click any template card to sign in and preview your content with that style.
          </p>
        </div>

        <div className="templates-showcase-grid">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="template-card-preview"
              onClick={() => onNavigate('login')}
              title={`Click to sign in and apply ${tmpl.name}`}
            >
              <div className={`template-visual-mock ${tmpl.mockClass}`}>
                <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.04em' }}>{tmpl.name}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '4px' }}>Live Responsive Theme</span>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {tmpl.name}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
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
                <span>Click to Sign In &amp; Use</span>
                <ArrowRight size={15} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS (3-STEP WORKFLOW) ================= */}
      <section className="landing-section" style={{ paddingTop: '1rem' }}>
        <div className="section-header">
          <div className="section-tag">
            <Sliders size={14} />
            <span>Simple Workflow</span>
          </div>
          <h2 className="section-title">How It Works in 3 Simple Steps</h2>
          <p className="section-desc">
            From zero to a fully published online portfolio with a live link and scannable QR code.
          </p>
        </div>

        <div className="how-it-works-grid">
          {steps.map((step) => (
            <div
              key={step.number}
              className="step-card"
              onClick={() => onNavigate('login')}
              style={{ cursor: 'pointer' }}
              title="Click to sign in"
            >
              <div className="step-number-badge">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM CTA BANNER ================= */}
      <section className="landing-section" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
        <div className="landing-cta-banner">
          <h2 className="cta-banner-title">Ready to Publish Your Standout Portfolio?</h2>
          <p className="cta-banner-desc">
            Join developers, designers, and engineers showcasing their work with custom themes, live QR codes, and recruiter-friendly ATS resume hosting.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('register')}
              style={{ padding: '0.85rem 2rem' }}
            >
              <UserPlus size={18} />
              <span>Get Started — It's Free</span>
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('login')}
              style={{ padding: '0.85rem 2rem' }}
            >
              <LogIn size={18} />
              <span>Sign In to Account</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
