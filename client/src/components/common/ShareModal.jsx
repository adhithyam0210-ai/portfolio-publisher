import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Modal } from './Modal';
import { useToast } from '../../context/ToastContext';
import {
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  MessageCircle,
  Linkedin,
  Twitter,
  Mail
} from 'lucide-react';

export const ShareModal = ({ isOpen, onClose, slug, title = "Share Your Portfolio" }) => {
  const toast = useToast();
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Full public URL
  const publicUrl = `${window.location.origin}/portfolio/${slug}`;

  useEffect(() => {
    if (isOpen && canvasRef.current && slug) {
      QRCode.toCanvas(
        canvasRef.current,
        publicUrl,
        {
          width: 220,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }
  }, [isOpen, publicUrl, slug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Portfolio link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast.error('Failed to copy link.');
    }
  };

  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${slug}-portfolio-qr.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    toast.success('QR Code downloaded successfully!');
  };

  // Social Share URLs
  const encodedUrl = encodeURIComponent(publicUrl);
  const shareText = encodeURIComponent(`Check out my professional portfolio built with PortfolioCraft: ${publicUrl}`);

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: '#25D366',
      url: `https://api.whatsapp.com/send?text=${shareText}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent('Check out my professional online portfolio:')}`
    },
    {
      name: 'Email',
      icon: Mail,
      color: '#EA4335',
      url: `mailto:?subject=${encodeURIComponent('My Professional Portfolio')}&body=${shareText}`
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="500px">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        {/* QR Code Canvas */}
        <div style={{
          background: '#ffffff',
          padding: '1.25rem',
          borderRadius: '18px',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <canvas ref={canvasRef} style={{ width: '200px', height: '200px', borderRadius: '8px' }} />
          <button
            onClick={handleDownloadQR}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', borderRadius: '8px' }}
          >
            <Download size={15} color="var(--accent-primary)" />
            <span>Download High-Res QR (PNG)</span>
          </button>
        </div>

        {/* Public Link Input + Copy Button */}
        <div style={{ width: '100%' }}>
          <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Public Portfolio URL</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="form-control"
              style={{ fontSize: '0.88rem', color: 'var(--text-main)', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', borderRadius: '10px' }}
              onClick={(e) => e.target.select()}
            />
            <button
              onClick={handleCopyLink}
              className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}
              style={{ minWidth: '110px', borderRadius: '10px' }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* 1-Click Social Shares */}
        <div style={{ width: '100%' }}>
          <label className="form-label" style={{ marginBottom: '0.6rem', display: 'block' }}>Share directly via</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
            {shareLinks.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{
                    flexDirection: 'column',
                    padding: '0.75rem 0.5rem',
                    gap: '0.4rem',
                    fontSize: '0.75rem'
                  }}
                >
                  <Icon size={20} color={s.color} />
                  <span>{s.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
