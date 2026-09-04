import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import {
  Users,
  UserCheck,
  Globe,
  Search,
  Shield,
  Trash2,
  ExternalLink,
  Eye,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const AdminDashboardPage = ({ onNavigate }) => {
  const { user, isAdmin } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected user for details modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Delete modal
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers({ search, role: roleFilter, status: statusFilter })
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
    } catch (err) {
      toast.error('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshTelemetry = async () => {
    try {
      setIsRefreshing(true);
      await fetchAdminData();
      toast.success('Telemetry data refreshed successfully!');
    } catch (err) {
      toast.error('Failed to refresh telemetry data.');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdminData();
    setIsSuggestOpen(false);
  };

  // Live filter users parallel to typing
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.full_name && u.full_name.toLowerCase().includes(q)) ||
      (u.slug && u.slug.toLowerCase().includes(q))
    );
  });

  // Top matching suggestions for the auto-suggest dropdown
  const suggestions = search.trim().length > 0 ? filteredUsers.slice(0, 6) : [];

  const handleToggleStatus = async (targetUser) => {
    const newStatus = targetUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminApi.toggleStatus(targetUser.id, newStatus);
      toast.success(`User ${targetUser.username} is now ${newStatus}`);
      setUsers((prev) => prev.map((u) => (u.id === targetUser.id ? { ...u, status: newStatus } : u)));
    } catch (err) {
      toast.error(err.message || 'Failed to update user status.');
    }
  };

  const handleOpenDeleteModal = (targetUser) => {
    setDeleteUserTarget(targetUser);
    setIsDeleteModalOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!deleteUserTarget) return;
    try {
      await adminApi.deleteUser(deleteUserTarget.id);
      toast.success(`User ${deleteUserTarget.username} and associated data deleted.`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteUserTarget.id));
      setIsDeleteModalOpen(false);
      // Refresh stats
      const statsRes = await adminApi.getStats();
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      toast.error(err.message || 'Failed to delete user.');
    }
  };

  const handleViewUserDetail = async (targetUser) => {
    try {
      const res = await adminApi.getUserDetails(targetUser.id);
      if (res.success) {
        setSelectedUser(res.user);
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      toast.error('Failed to retrieve user details.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <AlertCircle size={32} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
          You need an Administrator account with role `ADMIN` to view the Executive Platform Governance portal.
        </p>
        <button className="btn btn-primary" onClick={() => onNavigate('dashboard')}>
          Back to User Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Shield size={24} color="#ec4899" />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Platform Governance</span>
            <span className="cool-executive-badge" title="Executive System Administrator">
              <Shield size={12} />
              <span>EXECUTIVE ADMIN</span>
            </span>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleRefreshTelemetry}
            disabled={isRefreshing}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            title="Reload telemetry counters and user states"
          >
            <RefreshCw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Telemetry'}</span>
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
        {/* Security Notice */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          marginBottom: '2rem',
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Shield size={20} color="#10b981" style={{ flexShrink: 0 }} />
          <span>
            <strong style={{ color: 'var(--text-main)' }}>Platform Governance Policy:</strong> Administrators manage user credentials, lifecycle states, and system telemetry with read-only integrity for user creative portfolio content.
          </span>
        </div>

        {/* 1. Modern Telemetry Stats Grid (3 Core Cards: Users, Active/Inactive, Published Portfolios) */}
        {stats && (
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-info">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{stats.totalUsers}</div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.4rem', fontWeight: 600 }}>
                  +{stats.newRegistrations7d} in last 7 days
                </div>
              </div>
              <div className="admin-stat-icon icon-blue">
                <Users size={24} />
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-info">
                <div className="stat-label">Active / Inactive</div>
                <div className="stat-value">{stats.activeUsers} <span style={{ fontSize: '1.05rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {stats.inactiveUsers}</span></div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontWeight: 600 }}>
                  Active accounts
                </div>
              </div>
              <div className="admin-stat-icon icon-green">
                <UserCheck size={24} />
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-info">
                <div className="stat-label">Published Portfolios</div>
                <div className="stat-value">{stats.publishedPortfolios}</div>
                <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '0.4rem', fontWeight: 600 }}>
                  {stats.unpublishedPortfolios} in draft
                </div>
              </div>
              <div className="admin-stat-icon icon-amber">
                <Globe size={24} />
              </div>
            </div>
          </div>
        )}

        {/* 2. User Management Table */}
        <div className="admin-table-container">
          {/* Toolbar */}
          <div className="admin-toolbar">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Platform Users &amp; Portfolios</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Search with Live Auto-Suggest */}
              <div style={{ position: 'relative' }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    placeholder="Search user, email, slug..."
                    className="admin-search-input"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setIsSuggestOpen(true);
                    }}
                    onFocus={() => {
                      if (search.trim()) setIsSuggestOpen(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setIsSuggestOpen(false), 250);
                    }}
                  />
                  <button type="submit" className="btn btn-secondary btn-icon-only btn-sm" title="Search">
                    <Search size={15} />
                  </button>
                </form>

                {/* Auto-suggest dropdown menu */}
                {isSuggestOpen && suggestions.length > 0 && (
                  <div className="admin-search-suggestions">
                    {suggestions.map((s) => (
                      <div
                        key={s.id}
                        className="admin-suggestion-item"
                        onMouseDown={() => {
                          setSearch(s.full_name || s.username);
                          setIsSuggestOpen(false);
                        }}
                      >
                        <div className="user-mini-avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                          {(s.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {s.full_name ? `${s.full_name} (@${s.username})` : s.username}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {s.email}
                          </div>
                        </div>
                        <span className={`badge ${s.role === 'ADMIN' ? 'cool-admin-badge' : 'badge-user'}`} style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem' }}>
                          {s.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Role filter */}
              <select
                className="admin-select-filter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              {/* Status filter */}
              <select
                className="admin-select-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Portfolio Slug</th>
                  <th>Publication</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                      No matching users found for "{search}".
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-avatar-cell">
                          <div className="user-mini-avatar">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.full_name || u.username}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'ADMIN' ? 'cool-admin-badge' : 'badge-user'}`} style={{ fontSize: '0.65rem' }}>
                          {u.role === 'ADMIN' && <Shield size={10} style={{ marginRight: '0.25rem' }} />}
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                          /{u.slug || u.username}
                        </code>
                      </td>
                      <td>
                        <span className={`badge badge-${u.portfolio_status || 'draft'}`}>
                          {u.portfolio_status || 'draft'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        {/* Aligned 4-slot Action Toolbar (Reset password removed) */}
                        <div className="user-actions-aligned">
                          {/* Slot 1: Detail Modal */}
                          <button
                            className="btn btn-secondary btn-icon-only btn-sm action-btn-fixed"
                            onClick={() => handleViewUserDetail(u)}
                            title="View User Details"
                          >
                            <Eye size={14} />
                          </button>

                          {/* Slot 2: View Live Portfolio (Fixed slot width so rows never misalign) */}
                          {u.portfolio_status === 'published' ? (
                            <a
                              href={`/portfolio/${u.slug || u.username}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary btn-icon-only btn-sm action-btn-fixed"
                              title="Audit Published Portfolio"
                            >
                              <ExternalLink size={14} />
                            </a>
                          ) : (
                            <div className="action-btn-placeholder" />
                          )}

                          {/* Slot 3: Toggle Status (Fixed width 88px) */}
                          <button
                            className={`btn ${u.status === 'ACTIVE' ? 'btn-secondary' : 'btn-success'} btn-sm action-btn-status`}
                            onClick={() => handleToggleStatus(u)}
                            title={u.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                          >
                            {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>

                          {/* Slot 4: Delete User */}
                          <button
                            className="btn btn-danger btn-icon-only btn-sm action-btn-fixed"
                            onClick={() => handleOpenDeleteModal(u)}
                            title="Delete User Account"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="User Account Details"
        maxWidth="500px"
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div className="user-mini-avatar" style={{ width: '54px', height: '54px', fontSize: '1.3rem' }}>
                {selectedUser.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedUser.full_name || selectedUser.username}</h4>
                <div style={{ color: 'var(--text-secondary)' }}>{selectedUser.email}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered: {new Date(selectedUser.created_at).toLocaleString()}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ROLE</div>
                <div style={{ fontWeight: 600 }}>{selectedUser.role}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACCOUNT STATUS</div>
                <div style={{ fontWeight: 600 }}>{selectedUser.status}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PORTFOLIO STATUS</div>
                <div style={{ fontWeight: 600 }}>{selectedUser.portfolio_status || 'draft'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PORTFOLIO SLUG</div>
                <div><code>/{selectedUser.slug || selectedUser.username}</code></div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>CONTENT COUNTS</div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div><strong>{selectedUser.projects_count || 0}</strong> Projects</div>
                <div><strong>{selectedUser.experience_count || 0}</strong> Roles</div>
                <div><strong>{selectedUser.skills_count || 0}</strong> Skills</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        maxWidth="450px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Are you sure you want to delete account <strong>{deleteUserTarget?.username}</strong> ({deleteUserTarget?.email})?
          </p>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '0.85rem', color: '#fca5a5', fontSize: '0.85rem' }}>
            This action is permanent. All related portfolio records, projects, skills, education, and uploaded files will be permanently deleted via cascading delete.
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={handleExecuteDelete}>
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
