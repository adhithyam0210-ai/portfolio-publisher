import React from 'react';
import { Layers, Heart, Shield, Code } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-light)',
      background: 'var(--bg-card)',
      padding: '2.5rem 0 2rem',
      marginTop: 'auto',
      fontSize: '0.875rem',
      color: 'var(--text-muted)'
    }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Layers size={15} />
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>PortfolioCraft</span>
          <span>– Professional Portfolio Builder &amp; Publishing Platform</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Shield size={14} color="#10b981" /> Role-Based Security
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Code size={14} color="#6366f1" /> React + Express + SQLite
          </span>
        </div>

        <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p>© {new Date().getFullYear()} PortfolioCraft Inc. All rights reserved.</p>
          <p style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            Crafted with modern web aesthetics & performance
          </p>
        </div>
      </div>
    </footer>
  );
};
