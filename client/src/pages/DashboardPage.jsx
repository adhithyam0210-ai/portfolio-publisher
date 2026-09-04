import React, { useEffect, useState, useMemo } from 'react';
import { portfolioApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShareModal } from '../components/common/ShareModal';
import { Modal } from '../components/common/Modal';
import { PortfolioRenderer } from '../components/templates/PortfolioRenderer';
import {
  Edit3,
  Eye,
  Globe,
  Share2,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileText,
  Briefcase,
  Layers,
  Sparkles,
  QrCode,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const DashboardPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const res = await portfolioApi.getMyPortfolio();
      if (res.success) {
        setData(res.data || res);
      }
    } catch (err) {
      toast.error('Failed to load portfolio details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  // Compute profile completion percentage
  const completion = useMemo(() => {
    if (!data) return { percentage: 0, items: [] };

    const { profile = {}, education = [], skills = [], projects = [], experience = [], resume = null } = data;

    const items = [
      { name: 'Personal Profile (Name, Title, Bio)', weight: 20, completed: Boolean(profile.full_name && profile.professional_title && profile.short_intro) },
      { name: 'Projects (at least 1 project)', weight: 20, completed: projects.length > 0 },
      { name: 'Skills & Proficiencies (at least 3 skills)', weight: 15, completed: skills.length >= 3 },
      { name: 'Work Experience (at least 1 role)', weight: 15, completed: experience.length > 0 },
      { name: 'Education & Degree', weight: 15, completed: education.length > 0 },
      { name: 'Uploaded Resume Document', weight: 10, completed: Boolean(resume) },
      { name: 'Social Links (LinkedIn / GitHub)', weight: 5, completed: Boolean(profile.linkedin || profile.github) }
    ];

    const percentage = items.reduce((acc, curr) => (curr.completed ? acc + curr.weight : acc), 0);
    return { percentage, items };
  }, [data]);

  const handleTogglePublish = async () => {
    if (!data?.portfolio) return;
    setTogglingStatus(true);
    const currentStatus = data.portfolio.status;

    try {
      if (currentStatus === 'published') {
        await portfolioApi.unpublish();
        toast.info('Portfolio unpublished. It is no longer publicly visible.');
        setData({
          ...data,
          portfolio: { ...data.portfolio, status: 'unpublished' }
        });
      } else {
        const slug = data.portfolio?.slug || user.username;
        const res = await portfolioApi.publish(slug);
        toast.success('Congratulations! Your portfolio is now LIVE and publicly published.');
        setData({
          ...data,
          portfolio: { ...data.portfolio, status: 'published', slug: res.slug || slug }
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update publication status.');
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleCopyLink = async () => {
    if (!data?.portfolio?.slug) return;
    const url = `${window.location.origin}/portfolio/${data.portfolio.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Portfolio link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Could not copy link');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid var(--border-light)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Loading your portfolio dashboard...</p>
      </div>
    );
  }

  const portfolio = data?.portfolio || {};
  const profile = data?.profile || {};
  const slug = portfolio.slug || user?.username || 'user';
  const status = portfolio.status || 'draft';
  const isPublished = status === 'published';
  const publicUrl = `${window.location.origin}/portfolio/${slug}`;

  return (
    <div className="dashboard-wrap">
      {/* Welcome Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Welcome, {profile.full_name || user?.username}
            </h1>
            <span
              className="badge"
              style={{
                background: isPublished ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                color: isPublished ? '#10b981' : '#f59e0b',
                border: `1px solid ${isPublished ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                padding: '0.3rem 0.75rem',
                fontSize: '0.78rem'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isPublished ? '#10b981' : '#f59e0b', display: 'inline-block' }} />
              {isPublished ? 'LIVE & PUBLISHED' : 'DRAFT MODE'}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
            Manage your personal online portfolio, track profile completion, and share your live portfolio link.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-md"
            onClick={() => setIsShareOpen(true)}
            title="Share Portfolio"
            style={{ borderRadius: '12px' }}
          >
            <Share2 size={16} color="var(--accent-primary)" />
            <span>Share</span>
          </button>

          <button
            className="btn btn-primary btn-md"
            onClick={() => onNavigate('builder')}
            style={{ borderRadius: '12px' }}
          >
            <Edit3 size={16} />
            <span>Edit Portfolio</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Metric Strip */}
      <div className="stats-counter-strip">
        <div className="stat-metric-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
            <Layers size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {data?.projects?.length || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Showcase Projects</div>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.12)', color: '#ec4899' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {data?.skills?.length || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Verified Skills</div>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <Briefcase size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {data?.experience?.length || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Work Roles</div>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--accent-tag-bg)', color: 'var(--accent-primary)' }}>
            <Globe size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'capitalize' }}>
              {portfolio.template || 'Modern'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Design Style</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Status & Link Card + Completion Gauge */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Card 1: Public URL & Status Card */}
        <div className="cool-dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your Public Portfolio Link
              </span>
              <span
                className="badge"
                style={{
                  background: isPublished ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  color: isPublished ? '#10b981' : '#f59e0b'
                }}
              >
                {status.toUpperCase()}
              </span>
            </div>

            {/* Clean URL Container */}
            <div className="url-clean-box" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                <Globe size={18} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {publicUrl}
                </span>
              </div>
              <button
                onClick={handleCopyLink}
                className="btn btn-secondary btn-icon-only btn-sm"
                title="Copy link to clipboard"
                style={{ flexShrink: 0, borderRadius: '8px' }}
              >
                {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              </button>
            </div>

            {!isPublished ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: '#d97706', background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
                <AlertTriangle size={17} style={{ flexShrink: 0 }} />
                <span>Your portfolio is in draft mode. Click <strong>Publish Portfolio</strong> to make it live for recruiters.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
                <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
                <span>Your portfolio is public and accessible worldwide. Share your link below!</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
            <button
              onClick={handleTogglePublish}
              disabled={togglingStatus}
              className={`btn ${isPublished ? 'btn-secondary' : 'btn-primary'} btn-sm`}
              style={{ flex: 1, borderRadius: '10px' }}
            >
              <UploadCloud size={16} />
              <span>{isPublished ? 'Unpublish' : 'Publish Portfolio'}</span>
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, borderRadius: '10px' }}
              title="Share Portfolio"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>

            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '10px' }}
              title="Live Preview"
            >
              <Eye size={16} />
            </button>

            {isPublished && (
              <a
                href={`/portfolio/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-icon-only btn-sm"
                title="Open public page in new tab"
                style={{ borderRadius: '10px' }}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Card 2: Profile Completion Gauge */}
        <div className="cool-dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Profile Completion Score
              </span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: completion.percentage === 100 ? '#10b981' : 'var(--accent-primary)' }}>
                {completion.percentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: 'var(--bg-subtle)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: `${completion.percentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent-primary), #10b981)',
                  borderRadius: '9999px',
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>

            {/* Clean Checklist without overflow cutoffs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {completion.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: item.completed ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-subtle)',
                        color: item.completed ? '#10b981' : 'var(--text-muted)'
                      }}
                    >
                      {item.completed ? <Check size={11} strokeWidth={3} /> : <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} />}
                    </div>
                    <span style={{ color: item.completed ? 'var(--text-main)' : 'var(--text-secondary)', fontWeight: item.completed ? 600 : 400 }}>
                      {item.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: item.completed ? '#10b981' : 'var(--text-muted)',
                      background: item.completed ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                      padding: item.completed ? '0.15rem 0.45rem' : '0',
                      borderRadius: '6px'
                    }}
                  >
                    {item.completed ? 'Done' : `+${item.weight}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Launch Portfolio Builder Hero Card */}
      <div
        className="cool-dash-card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-subtle) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '2rem 2.25rem'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Sparkles size={18} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)' }}>
              Full Control Studio
            </span>
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Customize &amp; Elevate Your Portfolio
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.55 }}>
            Update your biographical info, upload projects, choose between 4 designer themes, attach your resume, and preview updates live.
          </p>
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={() => onNavigate('builder')}
          style={{ borderRadius: '12px', padding: '0.85rem 1.85rem', flexShrink: 0 }}
        >
          <Edit3 size={18} />
          <span>Open Portfolio Builder</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Share Modal Window */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        slug={slug}
      />

      {/* Fullscreen Live Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Live Portfolio Preview"
        maxWidth="1100px"
      >
        <div style={{ maxHeight: '75vh', overflowY: 'auto', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <PortfolioRenderer data={data} />
        </div>
      </Modal>
    </div>
  );
};
