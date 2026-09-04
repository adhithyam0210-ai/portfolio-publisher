import React from 'react';
import { Eye, CheckCircle2 } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const SECTIONS = [
  { id: 'about', label: 'About Me', desc: 'Personal bio, summary, and professional statement' },
  { id: 'skills', label: 'Skills & Tech Stack', desc: 'Technical competencies, frameworks, and tools' },
  { id: 'projects', label: 'Projects & Work', desc: 'Featured projects, live links, and GitHub repositories' },
  { id: 'experience', label: 'Career Experience', desc: 'Work history, roles, responsibilities, and timeline' },
  { id: 'education', label: 'Education & Degrees', desc: 'University degrees, academic milestones, and coursework' },
  { id: 'certifications', label: 'Certifications', desc: 'Licenses, credentials, and verification links' },
  { id: 'achievements', label: 'Achievements & Honors', desc: 'Awards, hackathons, and special recognitions' },
  { id: 'resume', label: 'Resume Download Button', desc: 'Public download button for your CV / Resume document' }
];

export const SectionVisibilityForm = ({ portfolio = {}, onVisibilityChange }) => {
  const toast = useToast();

  let visibility = {};
  if (portfolio?.section_visibility) {
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

  const handleToggleSection = async (secId) => {
    const isCurrentlyVisible = visibility[secId] !== false;
    const newVisibility = {
      ...visibility,
      [secId]: !isCurrentlyVisible
    };

    if (onVisibilityChange) {
      onVisibilityChange(newVisibility);
    }

    try {
      await portfolioApi.updateCustomization({
        section_visibility: newVisibility
      });
      toast.success(`${SECTIONS.find(s => s.id === secId)?.label || 'Section'} visibility updated!`);
    } catch (err) {
      console.error('Failed to auto-save section visibility:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <Eye size={22} color="var(--primary)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Section Visibility Controls</h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Select which sections appear on your published portfolio. Turning a section off hides it from visitors without deleting any of your saved data.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {SECTIONS.map((s) => {
          const isVisible = visibility[s.id] !== false;
          return (
            <div
              key={s.id}
              onClick={() => handleToggleSection(s.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '1.2rem',
                background: isVisible ? 'var(--bg-card)' : 'rgba(255,255,255,0.01)',
                border: `1.5px solid ${isVisible ? 'var(--primary)' : 'var(--border-light)'}`,
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: isVisible ? '0 4px 14px rgba(27, 67, 50, 0.08)' : 'none'
              }}
            >
              <div style={{ paddingRight: '1rem' }}>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: isVisible ? 'var(--text-main)' : 'var(--text-muted)',
                  marginBottom: '0.25rem'
                }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {s.desc}
                </div>
              </div>

              <input
                type="checkbox"
                checked={isVisible}
                onChange={() => {}}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: 'var(--primary)',
                  cursor: 'pointer',
                  marginTop: '2px',
                  flexShrink: 0
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
