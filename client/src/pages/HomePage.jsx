import React, { useState } from 'react';
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
  Cpu,
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  Lock,
  Download,
  BookOpen
} from 'lucide-react';
import { PortfolioRenderer } from '../components/templates/PortfolioRenderer';
import { getGmailComposeUrl } from '../utils/url';

// Curated 8 Templates with metadata and accent colors
const TEMPLATES_LIST = [
  {
    id: 'bento',
    name: 'Bento Grid',
    badge: 'Popular',
    icon: Grid,
    accent: '#6366f1',
    font: 'Inter',
    desc: 'Apple/Linear-inspired modular bento cards with responsive grids & action chips.'
  },
  {
    id: 'modern',
    name: 'Modern Glass',
    badge: 'Featured',
    icon: Sparkles,
    accent: '#10b981',
    font: 'Inter',
    desc: 'Frosted glassmorphism cards, vibrant glowing accents, and smooth lift physics.'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk HUD',
    badge: 'Futuristic',
    icon: Cpu,
    accent: '#06b6d4',
    font: 'JetBrains Mono',
    desc: 'Neon cyan & magenta high-tech HUD terminal with project filter and telemetry tags.'
  },
  {
    id: 'creative',
    name: 'Creative Flair',
    badge: 'Vibrant',
    icon: Palette,
    accent: '#ec4899',
    font: 'Poppins',
    desc: 'Warm playful gradients, asymmetrical cards, and vibrant pill badges.'
  },
  {
    id: 'minimal',
    name: 'Swiss Minimalist',
    badge: 'Clean',
    icon: Layers,
    accent: '#64748b',
    font: 'Inter',
    desc: 'High-contrast typography, generous whitespace, and razor-sharp border lines.'
  },
  {
    id: 'terminal',
    name: 'Developer Terminal',
    badge: 'Geek',
    icon: Code2,
    accent: '#22c55e',
    font: 'JetBrains Mono',
    desc: 'Hacker bash console with interactive command outputs and git branch markers.'
  },
  {
    id: 'editorial',
    name: 'Vogue Editorial',
    badge: 'Luxury',
    icon: BookOpen,
    accent: '#d97706',
    font: 'Playfair Display',
    desc: 'Monograph magazine aesthetic with luxury serif titles and numbered spreads.'
  },
  {
    id: 'brutalist',
    name: 'Neo-Brutalism',
    badge: 'Bold',
    icon: Zap,
    accent: '#f59e0b',
    font: 'Space Grotesk',
    desc: 'Bold 3px black borders, solid pop drop-shadows, and ticker marquee announcement.'
  }
];

// Rich, realistic sample portfolio data used for the live interactive showcase
const SAMPLE_PORTFOLIO_BASE = {
  profile: {
    full_name: 'Adhithya M',
    professional_title: 'Full-Stack Systems Engineer',
    location: 'Bangalore, India',
    email: 'adhithyam0210@gmail.com',
    phone: '9876543210',
    short_intro: 'Crafting high-throughput web applications, fault-tolerant backend architectures, and elegant user interfaces.',
    about: 'Software engineer passionate about building high-performance web systems, distributed API architectures, and polished interactive experiences. Experienced across modern JavaScript/TypeScript, React, Node.js, SQLite, and cloud deployment pipelines.',
    profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    github: 'https://github.com/adhithyam0210-ai',
    linkedin: 'https://linkedin.com/in/adhithya',
    twitter: 'https://twitter.com/adhithya',
    website: 'https://adhithya.dev'
  },
  skills: [
    { skill_name: 'React.js', proficiency: 'Expert' },
    { skill_name: 'Node.js & Express', proficiency: 'Advanced' },
    { skill_name: 'TypeScript', proficiency: 'Advanced' },
    { skill_name: 'SQLite & PostgreSQL', proficiency: 'Advanced' },
    { skill_name: 'Cloud & Vercel Deployments', proficiency: 'Expert' },
    { skill_name: 'Tailwind & Modern CSS', proficiency: 'Expert' },
    { skill_name: 'RESTful API Architecture', proficiency: 'Expert' },
    { skill_name: 'Python', proficiency: 'Intermediate' }
  ],
  projects: [
    {
      title: 'PortfolioCraft Publisher Platform',
      description: 'An all-in-one developer portfolio builder featuring 8 distinct templates, live interactive synchronization, and serverless hosting.',
      technologies: 'React, Node.js, Express, SQLite, Vercel',
      live_url: 'https://portfolio-publisher-app.vercel.app',
      github_url: 'https://github.com/adhithyam0210-ai/portfolio-publisher',
      image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Distributed Telemetry Engine',
      description: 'High-throughput event ingest and metrics tracing platform featuring real-time stream aggregation and alerting.',
      technologies: 'Node.js, WebSockets, Redis, Chart.js',
      live_url: 'https://demo.example.com',
      github_url: 'https://github.com/adhithyam0210-ai/telemetry',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'
    }
  ],
  resume: {
    original_name: 'Adhithya_Resume.pdf',
    download_url: '#'
  },
  settings: {
    contact_visible: 1,
    resume_downloadable: 1,
    email_visible: 1,
    phone_visible: 0
  },
  visibility: {
    about: true,
    skills: true,
    projects: true,
    resume: true
  }
};

export const HomePage = ({ onNavigate }) => {
  // Active state for the interactive showcase
  const [activeTemplateId, setActiveTemplateId] = useState('bento');
  const [activeTheme, setActiveTheme] = useState('dark');
  const [activeViewport, setActiveViewport] = useState('desktop'); // desktop | tablet | mobile

  const activeTemplate = TEMPLATES_LIST.find((t) => t.id === activeTemplateId) || TEMPLATES_LIST[0];

  // Dynamic portfolio object for the live renderer
  const showcaseData = {
    ...SAMPLE_PORTFOLIO_BASE,
    portfolio: {
      slug: 'adhithya',
      title: `${SAMPLE_PORTFOLIO_BASE.profile.full_name} — Portfolio`,
      template: activeTemplate.id,
      theme: activeTheme,
      accent_color: activeTemplate.accent,
      font_family: activeTemplate.font,
      status: 'PUBLISHED'
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page-wrap">
      {/* ================= HERO SECTION ================= */}
      <section className="landing-hero" style={{ paddingBottom: '3rem' }}>
        <div className="landing-pill-tag">
          <Sparkles size={15} />
          <span>8 Next-Gen Working Templates • 1-Click Publishing</span>
        </div>

        <h1 className="landing-title">
          Your Standout Developer Portfolio.{' '}
          <span className="landing-title-gradient">Crafted &amp; Live in Seconds.</span>
        </h1>

        <p className="landing-subtitle">
          Transform your projects, technical skills, and resume into a beautifully customized portfolio.
          Choose an aesthetic, personalize in real time, and share your unique public link with recruiters.
        </p>

        {/* Primary Action Buttons */}
        <div className="landing-hero-actions" style={{ marginBottom: '1.5rem' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('register')}
            style={{ fontSize: '1.02rem', padding: '0.85rem 1.85rem' }}
          >
            <UserPlus size={18} />
            <span>Create Free Portfolio</span>
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => scrollToSection('interactive-showcase')}
            style={{ fontSize: '1.02rem', padding: '0.85rem 1.85rem' }}
          >
            <Palette size={18} />
            <span>Explore Templates</span>
          </button>

          <button
            className="btn btn-outline btn-lg"
            onClick={() => onNavigate('login')}
            style={{ fontSize: '1.02rem', padding: '0.85rem 1.5rem' }}
          >
            <LogIn size={18} />
            <span>Sign In</span>
          </button>
        </div>
      </section>

      {/* ================= INTERACTIVE LIVE SHOWCASE SECTION ================= */}
      <section id="interactive-showcase" className="landing-section" style={{ paddingTop: '0.5rem', paddingBottom: '4rem' }}>
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <div className="section-tag">
            <Zap size={14} />
            <span>Interactive Live Showcase</span>
          </div>
          <h2 className="section-title">Experience Every Template Live</h2>
          <p className="section-desc">
            Click any style below to see how your portfolio looks in real time. Switch themes and screen sizes instantly.
          </p>
        </div>

        <div className="showcase-wrapper">
          {/* 1. Horizontal Template Selector Tabs */}
          <div className="showcase-tabs-bar">
            {TEMPLATES_LIST.map((tmpl) => {
              const Icon = tmpl.icon;
              const isActive = activeTemplateId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setActiveTemplateId(tmpl.id)}
                  className={`showcase-tab-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} color={isActive ? undefined : tmpl.accent} />
                  <span>{tmpl.name}</span>
                  <span className="showcase-tab-badge" style={{ background: isActive ? 'rgba(255,255,255,0.2)' : `${tmpl.accent}22`, color: isActive ? 'inherit' : tmpl.accent }}>
                    {tmpl.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2. Mockup Device Chrome Bar */}
          <div className="showcase-controls-bar">
            {/* Left: Window Dots & Mock Address Bar */}
            <div className="showcase-mock-browser-bar">
              <div className="showcase-dots">
                <span className="showcase-dot red" />
                <span className="showcase-dot yellow" />
                <span className="showcase-dot green" />
              </div>
              <div className="showcase-url-input">
                <Lock size={12} />
                <span>portfoliocraft.com/portfolio/adhithya?style={activeTemplate.id}</span>
              </div>
            </div>

            {/* Right: Viewport Controls, Theme Toggle & Direct CTA */}
            <div className="showcase-actions-group">
              {/* Device Viewport Toggle */}
              <div className="showcase-pill-toggle">
                <button
                  type="button"
                  onClick={() => setActiveViewport('desktop')}
                  className={`showcase-toggle-option ${activeViewport === 'desktop' ? 'active' : ''}`}
                  title="Desktop View (100%)"
                >
                  <Monitor size={14} />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewport('tablet')}
                  className={`showcase-toggle-option ${activeViewport === 'tablet' ? 'active' : ''}`}
                  title="Tablet View (768px)"
                >
                  <Tablet size={14} />
                  <span>Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewport('mobile')}
                  className={`showcase-toggle-option ${activeViewport === 'mobile' ? 'active' : ''}`}
                  title="Mobile View (380px)"
                >
                  <Smartphone size={14} />
                  <span>Mobile</span>
                </button>
              </div>

              {/* Theme Toggle (Dark / Light) */}
              <div className="showcase-pill-toggle">
                <button
                  type="button"
                  onClick={() => setActiveTheme('dark')}
                  className={`showcase-toggle-option ${activeTheme === 'dark' ? 'active' : ''}`}
                  title="Dark Mode"
                >
                  <Moon size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTheme('light')}
                  className={`showcase-toggle-option ${activeTheme === 'light' ? 'active' : ''}`}
                  title="Light Mode"
                >
                  <Sun size={14} />
                </button>
              </div>

              {/* "Use This Template" Action Button */}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="btn btn-primary btn-sm"
                style={{
                  borderRadius: '9999px',
                  padding: '0.45rem 1rem',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>Use {activeTemplate.name}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* 3. The Live Interactive Preview Window */}
          <div className="showcase-browser-frame">
            <div className={`showcase-viewport-container ${activeViewport}`}>
              <PortfolioRenderer data={showcaseData} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3 CORE PILLARS (ONLY ESSENTIAL FEATURES) ================= */}
      <section className="landing-section" style={{ paddingTop: '1rem', paddingBottom: '3.5rem' }}>
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} />
            <span>Core Highlights</span>
          </div>
          <h2 className="section-title">Built for Real Career Impact</h2>
          <p className="section-desc">
            Every feature is focused on making your work undeniable to recruiters and hiring managers.
          </p>
        </div>

        <div className="core-pillars-grid">
          {/* Pillar 1 */}
          <div className="settings-card-smooth" style={{ margin: 0, padding: '1.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Palette size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              8 Handcrafted Aesthetics
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Switch freely between Bento Grid, Cyberpunk Neon, Modern Glass, Minimalist, Terminal, Editorial, and Neo-Brutalist layouts with 1 click.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="settings-card-smooth" style={{ margin: 0, padding: '1.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Globe size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Custom Slug &amp; QR Code
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Claim your personalized link (<code>/portfolio/:slug</code>) and generate high-resolution QR codes to put on your resume or business cards.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="settings-card-smooth" style={{ margin: 0, padding: '1.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <FileText size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              ATS Resume &amp; Gmail Direct
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Host your PDF resume with direct 1-click recruiter downloads and contact links that redirect straight to Gmail web compose.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 3-STEP WORKFLOW ================= */}
      <section className="landing-section" style={{ paddingTop: '0.5rem', paddingBottom: '3.5rem' }}>
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
          <div className="step-card" onClick={() => onNavigate('register')} style={{ cursor: 'pointer' }}>
            <div className="step-number-badge">1</div>
            <h3 className="step-title">Create Account</h3>
            <p className="step-desc">Sign up in seconds and claim your unique profile slug.</p>
          </div>

          <div className="step-card" onClick={() => onNavigate('register')} style={{ cursor: 'pointer' }}>
            <div className="step-number-badge">2</div>
            <h3 className="step-title">Add Projects &amp; Resume</h3>
            <p className="step-desc">Add your live projects, technical skills, and upload your resume.</p>
          </div>

          <div className="step-card" onClick={() => onNavigate('register')} style={{ cursor: 'pointer' }}>
            <div className="step-number-badge">3</div>
            <h3 className="step-title">Pick Template &amp; Publish</h3>
            <p className="step-desc">Select your preferred visual style and share your live portfolio link.</p>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA & GMAIL CONTACT ================= */}
      <section className="landing-section" style={{ paddingTop: '0.5rem', paddingBottom: '3rem' }}>
        <div className="landing-cta-banner">
          <h2 className="cta-banner-title">Ready to Publish Your Standout Portfolio?</h2>
          <p className="cta-banner-desc">
            Create an account, choose from 8 handcrafted templates, and share your personalized link with the world.
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
