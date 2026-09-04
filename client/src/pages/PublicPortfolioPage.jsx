import React, { useEffect, useState } from 'react';
import { publicApi } from '../services/api';
import { PortfolioRenderer } from '../components/templates/PortfolioRenderer';
import { Layers, EyeOff, AlertCircle, ArrowLeft, ArrowUpRight } from 'lucide-react';

export const PublicPortfolioPage = ({ slug, onNavigateHome }) => {
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    const fetchPublicData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setErrorData(null);
        const res = await publicApi.getPortfolio(slug);
        if (res.success) {
          setPortfolioData(res);
        }
      } catch (err) {
        console.error('Failed to load public portfolio:', err);
        setErrorData(err.data || { message: err.message || 'Portfolio not found' });
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', color: '#fff' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1.25rem', color: '#94a3b8', fontSize: '0.95rem' }}>Loading portfolio...</p>
      </div>
    );
  }

  // Handle unpublished or inactive status
  if (errorData) {
    const isDraftOrUnpublished = errorData.code === 'UNPUBLISHED';
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', color: '#fff', padding: '2rem' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '3rem 2rem', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: isDraftOrUnpublished ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: isDraftOrUnpublished ? '#f59e0b' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            {isDraftOrUnpublished ? <EyeOff size={28} /> : <AlertCircle size={28} />}
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            {isDraftOrUnpublished ? 'Portfolio Not Published' : 'Portfolio Not Found'}
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {errorData.message || 'This portfolio is currently unavailable or has not been published yet.'}
          </p>

          <button
            onClick={() => {
              if (onNavigateHome) onNavigateHome();
              else window.location.href = '/';
            }}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <ArrowLeft size={16} />
            <span>Go to PortfolioCraft Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Floating Modern Brand Badge */}
      <div className="portfoliocraft-badge-container">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="portfoliocraft-published-badge"
          title="Build your own professional portfolio with PortfolioCraft"
        >
          <span className="badge-glow" />
          <div className="badge-icon-box">
            <Layers size={14} className="badge-icon" />
          </div>
          <div className="badge-text-group">
            <span className="badge-prefix">Published with</span>
            <span className="badge-brand">
              PortfolioCraft<span className="badge-dot">.</span>
            </span>
          </div>
          <div className="badge-arrow">
            <ArrowUpRight size={12} />
          </div>
        </a>
      </div>

      {/* Render Template */}
      <PortfolioRenderer data={portfolioData} />
    </div>
  );
};
