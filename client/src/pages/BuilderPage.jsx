import React, { useEffect, useState } from 'react';
import { portfolioApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PortfolioRenderer } from '../components/templates/PortfolioRenderer';
import { ShareModal } from '../components/common/ShareModal';

import { PersonalInfoForm } from '../components/builder/PersonalInfoForm';
import { EducationForm } from '../components/builder/EducationForm';
import { SkillsForm } from '../components/builder/SkillsForm';
import { ProjectsForm } from '../components/builder/ProjectsForm';
import { ExperienceForm } from '../components/builder/ExperienceForm';
import { CertificationsForm } from '../components/builder/CertificationsForm';
import { AchievementsForm } from '../components/builder/AchievementsForm';
import { ResumeForm } from '../components/builder/ResumeForm';
import { CustomizationForm } from '../components/builder/CustomizationForm';

import {
  User,
  GraduationCap,
  Sparkles,
  Code,
  Briefcase,
  Award,
  Trophy,
  FileText,
  Palette,
  Save,
  UploadCloud,
  Eye,
  ExternalLink,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Edit3
} from 'lucide-react';

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'customization', label: 'Template & Design', icon: Palette },
  { id: 'projects', label: 'Projects', icon: Code },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'resume', label: 'Resume / CV', icon: FileText }
];

export const BuilderPage = ({ initialTab = 'personal', onNavigate }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [mobileView, setMobileView] = useState('editor'); // 'editor' or 'preview' on small viewports
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Core state containing portfolio, profile, lists, and settings
  const [data, setData] = useState({
    portfolio: {},
    profile: {},
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: [],
    achievements: [],
    resume: null,
    settings: {}
  });

  const loadPortfolio = async () => {
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
    loadPortfolio();
  }, []);

  // Save changes (Profile & Customization)
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      if (data.profile) {
        await portfolioApi.updateProfile(data.profile);
      }
      if (data.portfolio) {
        await portfolioApi.updateCustomization({
          template: data.portfolio.template,
          theme: data.portfolio.theme,
          font_family: data.portfolio.font_family,
          accent_color: data.portfolio.accent_color,
          section_visibility: data.portfolio.section_visibility
        });
      }
      await portfolioApi.saveDraft();
      toast.success('All changes saved to draft!');
    } catch (err) {
      toast.error('Failed to save draft: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  // Publish Portfolio
  const handlePublish = async () => {
    setPublishing(true);
    try {
      if (data.profile) {
        await portfolioApi.updateProfile(data.profile);
      }
      if (data.portfolio) {
        await portfolioApi.updateCustomization({
          template: data.portfolio.template,
          theme: data.portfolio.theme,
          font_family: data.portfolio.font_family,
          accent_color: data.portfolio.accent_color,
          section_visibility: data.portfolio.section_visibility
        });
      }

      const slug = data.portfolio?.slug || user?.username;
      const res = await portfolioApi.publish(slug);
      toast.success('Your portfolio is now published and live!');
      setData((prev) => ({
        ...prev,
        portfolio: { ...prev.portfolio, status: 'published', slug: res.slug || slug }
      }));
    } catch (err) {
      toast.error('Failed to publish: ' + (err.message || 'Error'));
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid var(--border-light)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Loading portfolio studio...</p>
      </div>
    );
  }

  const slug = data.portfolio?.slug || user?.username;
  const status = data.portfolio?.status || 'draft';
  const isPublished = status === 'published';

  return (
    <div className="builder-layout-wrapper">
      {/* Top Builder Toolbar (Theme-aware) */}
      <div className="builder-header-bar">
        {/* Left: Back to Dashboard & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={() => onNavigate('dashboard')}
            className="btn btn-secondary btn-icon-only btn-sm"
            title="Back to Dashboard"
            style={{ borderRadius: '8px' }}
          >
            <ArrowLeft size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Portfolio Builder
            </span>
            <span
              className="badge"
              style={{
                background: isPublished ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                color: isPublished ? '#10b981' : '#f59e0b',
                border: `1px solid ${isPublished ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
              }}
            >
              {isPublished && <CheckCircle2 size={11} />}
              {status.toUpperCase()}
            </span>
          </div>

          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'none' }} className="d-md-inline">
            /portfolio/{slug}
          </span>
        </div>

        {/* Center: Mobile/Tablet View Switcher (Only visible on small viewports) */}
        <div className="builder-mobile-switch">
          <button
            onClick={() => setMobileView('editor')}
            className={`btn btn-sm ${mobileView === 'editor' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
          >
            <Edit3 size={13} />
            <span>Edit Form</span>
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`btn btn-sm ${mobileView === 'preview' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
          >
            <Eye size={13} />
            <span>Live Preview</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsShareOpen(true)}
            className="btn btn-secondary btn-sm"
            title="Share Portfolio"
            style={{ borderRadius: '8px' }}
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>

          {isPublished && (
            <a
              href={`/portfolio/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              title="Open public live URL"
              style={{ borderRadius: '8px' }}
            >
              <ExternalLink size={14} />
              <span>View Live</span>
            </a>
          )}

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '8px' }}
          >
            <Save size={14} />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: '8px' }}
          >
            <UploadCloud size={14} />
            <span>{publishing ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Main Harmonized Split Workspace */}
      <div className="builder-split-workspace">
        {/* Left Side: Navigation Tabs + Input Forms (Theme-aware) */}
        <div className={`builder-form-pane ${mobileView === 'preview' ? 'hidden-on-mobile' : ''}`}>
          {/* Scrollable Horizontal Tabs Bar */}
          <div className="builder-tabs-track">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`builder-tab-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Form Content */}
          <div className="builder-form-body">
            {activeTab === 'personal' && (
              <PersonalInfoForm
                profile={data.profile || {}}
                onChange={(updatedProfile) => setData({ ...data, profile: updatedProfile })}
                onProfilePhotoUpdated={(url) =>
                  setData((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, profile_image: url }
                  }))
                }
              />
            )}

            {activeTab === 'customization' && (
              <CustomizationForm
                portfolio={data.portfolio || {}}
                onChange={(updatedPortfolio) => setData({ ...data, portfolio: updatedPortfolio })}
              />
            )}

            {activeTab === 'education' && (
              <EducationForm
                education={data.education || []}
                onListChange={(list) => setData({ ...data, education: list })}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsForm
                skills={data.skills || []}
                onListChange={(list) => setData({ ...data, skills: list })}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsForm
                projects={data.projects || []}
                onListChange={(list) => setData({ ...data, projects: list })}
              />
            )}

            {activeTab === 'experience' && (
              <ExperienceForm
                experience={data.experience || []}
                onListChange={(list) => setData({ ...data, experience: list })}
              />
            )}

            {activeTab === 'certifications' && (
              <CertificationsForm
                certifications={data.certifications || []}
                onListChange={(list) => setData({ ...data, certifications: list })}
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsForm
                achievements={data.achievements || []}
                onListChange={(list) => setData({ ...data, achievements: list })}
              />
            )}

            {activeTab === 'resume' && (
              <ResumeForm
                resume={data.resume}
                onResumeUpdated={(updatedResume) => setData({ ...data, resume: updatedResume })}
              />
            )}
          </div>
        </div>

        {/* Right Side: Live Interactive Synchronized Preview (Natural full width) */}
        <div className={`builder-preview-pane ${mobileView === 'editor' ? 'hidden-on-mobile' : ''}`}>
          <div className="builder-preview-card-wrap">
            <PortfolioRenderer data={data} />
          </div>
        </div>
      </div>

      {/* Share Modal Window */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        slug={slug}
      />
    </div>
  );
};
