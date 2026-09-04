import React from 'react';
import { Palette, Type, Sun, Moon, Eye, Check } from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'Indigo', color: '#6366f1' },
  { name: 'Cyan', color: '#06b6d4' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Rose', color: '#ec4899' },
  { name: 'Violet', color: '#8b5cf6' },
  { name: 'Blue', color: '#2563eb' }
];

const FONTS = [
  { id: 'Inter', label: 'Inter (Modern Sans)', sample: 'Clean & highly legible' },
  { id: 'Outfit', label: 'Outfit (Geometric)', sample: 'Bold, contemporary header font' },
  { id: 'Space Grotesk', label: 'Space Grotesk (Tech)', sample: 'Technical aesthetic for devs' },
  { id: 'Playfair Display', label: 'Playfair Display (Editorial)', sample: 'Classic, refined elegance' },
  { id: 'Roboto', label: 'Roboto (Neutral)', sample: 'Balanced, standard readability' }
];

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern Glass',
    desc: 'Glassmorphism cards, glowing gradient badges, hover lifts, tech-forward vibe.',
    badge: 'Popular'
  },
  {
    id: 'professional',
    name: 'Executive Timeline',
    desc: 'Structured timeline layout, corporate slate tones, clean metadata hierarchy.',
    badge: 'Corporate'
  },
  {
    id: 'minimal',
    name: 'Swiss Minimalist',
    desc: 'High-contrast typography, thin line dividers, generous whitespace, sleek.',
    badge: 'Clean'
  },
  {
    id: 'creative',
    name: 'Creative Flair',
    desc: 'Asymmetrical project cards, morphing profile avatar, vivid neon highlights.',
    badge: 'Expressive'
  },
  {
    id: 'terminal',
    name: 'Developer Terminal',
    desc: 'Monospace hacker console with bash prompts, matrix green accents, and git logs.',
    badge: 'DevOps'
  },
  {
    id: 'editorial',
    name: 'Vogue Editorial',
    desc: 'Magazine serif typography, high-fashion layout, asymmetric spreads, luxury vibe.',
    badge: 'Editorial'
  },
  {
    id: 'brutalist',
    name: 'Neo-Brutalism Pop',
    desc: 'Bold 3px solid black borders, hard drop-shadows, sticker tags, retro 90s aesthetic.',
    badge: 'Trendy'
  }
];

const SECTIONS = [
  { id: 'about', label: 'About Me' },
  { id: 'skills', label: 'Skills & Tech Stack' },
  { id: 'projects', label: 'Projects & Work' },
  { id: 'experience', label: 'Career Experience' },
  { id: 'education', label: 'Education & Degrees' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'achievements', label: 'Achievements & Honors' },
  { id: 'resume', label: 'Resume Download Button' }
];

export const CustomizationForm = ({ portfolio, onChange }) => {
  const currentTemplate = portfolio.template || 'modern';
  const currentTheme = portfolio.theme || 'dark';
  const currentFont = portfolio.font_family || 'Inter';
  const currentAccent = portfolio.accent_color || '#6366f1';

  let visibility = {};
  if (portfolio.section_visibility) {
    if (typeof portfolio.section_visibility === 'string') {
      try {
        visibility = JSON.parse(portfolio.section_visibility);
      } catch (e) {
        visibility = {};
      }
    } else {
      visibility = portfolio.section_visibility;
    }
  }

  const handleUpdate = (field, value) => {
    onChange({ ...portfolio, [field]: value });
  };

  const handleToggleSection = (secId) => {
    const isCurrentlyVisible = visibility[secId] !== false;
    const newVisibility = {
      ...visibility,
      [secId]: !isCurrentlyVisible
    };
    handleUpdate('section_visibility', newVisibility);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* 1. Template Selection */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
          Select Portfolio Template
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Choose a visual design archetype that best represents your career persona.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {TEMPLATES.map((t) => {
            const isSelected = currentTemplate === t.id;
            return (
              <div
                key={t.id}
                onClick={() => handleUpdate('template', t.id)}
                style={{
                  background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                    {t.name}
                  </span>
                  <span className="badge badge-user" style={{ fontSize: '0.65rem' }}>{t.badge}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {t.desc}
                </p>
                {isSelected && (
                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Theme & Accent Color */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {/* Theme Mode */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Color Theme</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Light or dark background appearance.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className={`btn ${currentTheme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => handleUpdate('theme', 'dark')}
            >
              <Moon size={16} /> Dark Mode
            </button>
            <button
              type="button"
              className={`btn ${currentTheme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => handleUpdate('theme', 'light')}
            >
              <Sun size={16} /> Light Mode
            </button>
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Accent Highlight Color</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Used for links, badges, borders, and buttons.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {COLOR_PRESETS.map((p) => {
              const isSelected = currentAccent.toLowerCase() === p.color.toLowerCase();
              return (
                <button
                  key={p.color}
                  type="button"
                  onClick={() => handleUpdate('accent_color', p.color)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: p.color,
                    border: isSelected ? '3px solid #ffffff' : '2px solid transparent',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 10px ' + p.color : 'none',
                    transition: 'transform 0.15s ease'
                  }}
                  title={p.name}
                />
              );
            })}
            <input
              type="color"
              value={currentAccent}
              onChange={(e) => handleUpdate('accent_color', e.target.value)}
              style={{ width: '36px', height: '36px', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
              title="Custom Color"
            />
          </div>
        </div>
      </div>

      {/* 3. Typography Selection */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Font Typography</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Select a font pairing for your portfolio headings and text.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {FONTS.map((f) => {
            const isSelected = currentFont === f.id;
            return (
              <div
                key={f.id}
                onClick={() => handleUpdate('font_family', f.id)}
                style={{
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  borderRadius: '10px',
                  padding: '1rem',
                  cursor: 'pointer',
                  fontFamily: `"${f.id}", sans-serif`
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{f.id}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{f.sample}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Section Visibility Toggles */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Section Visibility</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Toggle sections on or off without deleting their stored content.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {SECTIONS.map((s) => {
            const isVisible = visibility[s.id] !== false;
            return (
              <label
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{s.label}</span>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => handleToggleSection(s.id)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
