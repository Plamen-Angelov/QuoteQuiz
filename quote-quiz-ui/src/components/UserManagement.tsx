import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import '../styles/AdminManagement.css';

interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = { username: '', email: '', isActive: true };

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('CreatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saveError, setSaveError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsersPaginated(search || undefined, page, pageSize, sortBy, sortDirection);
      if (Array.isArray(data)) {
        setUsers(data);
        setTotal(data.length);
      } else {
        setUsers(data.items ?? data.data ?? data.users ?? []);
        setTotal(data.total ?? data.count ?? data.totalCount ?? 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page, pageSize, sortBy, sortDirection]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setSaveError('');
    setShowEditor(true);
  };

  const handleEdit = (u: User) => {
    setEditing(u);
    setForm({ username: u.username, email: u.email, isActive: u.isActive });
    setSaveError('');
    setShowEditor(true);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditing(null);
    setForm(emptyForm);
    setSaveError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await apiService.deleteUser(id);
      fetchUsers();
    } catch {
      alert('Failed to delete user');
    }
  };

  const handleToggleActive = async (u: User) => {
    try {
      await apiService.updateUser(u.id, { ...u, isActive: !u.isActive });
      fetchUsers();
    } catch {
      alert('Failed to update user status');
    }
  };

  const handleSave = async () => {
    if (!form.username.trim()) { setSaveError('Username is required'); return; }
    setSaveError('');
    try {
      if (editing) {
        await apiService.updateUser(editing.id, form);
      } else {
        await apiService.createUser(form);
      }
      handleCancel();
      fetchUsers();
    } catch (err: any) {
      setSaveError(err?.response?.data?.message ?? err?.message ?? 'Failed to save user');
    }
  };

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="page-title-row">
          <button className="back-btn" onClick={() => navigate('/admin')}>← Back</button>
          <h1>User Management</h1>
        </div>
      </header>

      <div className="controls">
        <input
          placeholder="Search by username or email"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <label>Per page:
          <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </label>
        <label>Sort by:
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="CreatedAt">Created At</option>
            <option value="username">Username</option>
            <option value="email">Email</option>
          </select>
        </label>
        <select value={sortDirection} onChange={e => setSortDirection(e.target.value as 'asc' | 'desc')}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <button className="action-btn" onClick={openNew}>+ New User</button>
      </div>

      <div className="list">
        {loading ? (
          <p className="loading-msg">Loading...</p>
        ) : users.length === 0 ? (
          <p className="empty-msg">No users found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={!u.isActive ? 'row-inactive' : ''}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`status-badge ${u.isActive ? 'active' : 'inactive'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-cell">
                      <button className="btn-sm" onClick={() => handleEdit(u)}>Edit</button>
                      <button className="btn-sm btn-toggle" onClick={() => handleToggleActive(u)}>
                        {u.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button className="btn-sm btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {page} of {totalPages} ({total} total)</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      {showEditor && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editing ? 'Edit User' : 'New User'}</h3>
            {saveError && <p className="form-error">{saveError}</p>}
            <div className="form-field">
              <label>Username</label>
              <input
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Enter username"
                autoFocus
              />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            {editing && (
              <div className="form-field form-field-inline">
                <label>Active</label>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                />
              </div>
            )}
            <div className="editor-actions">
              <button onClick={handleSave}>{editing ? 'Save Changes' : 'Create User'}</button>
              <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
