import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

export const DeviceSwitcher = ({ device, onDeviceChange }) => {
  const devices = [
    { id: 'desktop', label: 'Desktop (100%)', icon: Monitor },
    { id: 'tablet', label: 'Tablet (768px)', icon: Tablet },
    { id: 'mobile', label: 'Mobile (375px)', icon: Smartphone }
  ];

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: 'rgba(15, 23, 42, 0.8)',
      padding: '0.25rem',
      borderRadius: '10px',
      border: '1px solid var(--border-subtle)',
      gap: '0.25rem'
    }}>
      {devices.map((d) => {
        const Icon = d.icon;
        const isActive = device === d.id;
        return (
          <button
            key={d.id}
            onClick={() => onDeviceChange(d.id)}
            className="btn btn-sm"
            style={{
              background: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              gap: '0.35rem'
            }}
            title={d.label}
          >
            <Icon size={16} />
            <span style={{ fontSize: '0.75rem', display: 'inline' }}>{d.id.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
};
