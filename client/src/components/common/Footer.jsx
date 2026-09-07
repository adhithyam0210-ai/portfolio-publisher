import React from 'react';
import { Layers, Mail } from 'lucide-react';
import { getGmailComposeUrl } from '../../utils/url';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-light)',
      background: 'var(--bg-card)',
      padding: '0.85rem 0',
      marginTop: 'auto',
      fontSize: '0.825rem',
      color: 'var(--text-muted)'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '7px',
            background: 'var(--accent-primary, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <Layers size={14} />
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.875rem' }}>PortfolioCraft</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>– Professional Portfolio Publisher</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a
            href={getGmailComposeUrl('adhithyam0210@gmail.com', 'PortfolioCraft Platform Inquiry')}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
          >
            <Mail size={13} /> Contact (Gmail)
          </a>
          <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} PortfolioCraft Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
