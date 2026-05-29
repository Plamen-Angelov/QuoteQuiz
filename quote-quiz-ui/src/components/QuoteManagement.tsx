import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import '../styles/AdminManagement.css';

interface Quote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

const emptyForm = { text: '', author: '' };

const QuoteManagement: React.FC = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('CreatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState<Quote | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saveError, setSaveError] = useState('');

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getQuotesPaginated(search || undefined, page, pageSize, sortBy, sortDirection);
      if (Array.isArray(data)) {
        setQuotes(data);
        setTotal(data.length);
      } else {
        setQuotes(data.items ?? data.data ?? data.quotes ?? []);
        setTotal(data.total ?? data.count ?? data.totalCount ?? 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuotes(); }, [search, page, pageSize, sortBy, sortDirection]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setSaveError('');
    setShowEditor(true);
  };

  const handleEdit = (q: Quote) => {
    setEditing(q);
    setForm({ text: q.text, author: q.author });
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
    if (!confirm('Delete this quote?')) return;
    try {
      await apiService.deleteQuote(id);
      fetchQuotes();
    } catch {
      alert('Failed to delete quote');
    }
  };

  const handleSave = async () => {
    if (!form.text.trim()) { setSaveError('Quote text is required'); return; }
    if (!form.author.trim()) { setSaveError('Author is required'); return; }
    setSaveError('');
    try {
      if (editing) {
        await apiService.updateQuote(editing.id, form);
      } else {
        await apiService.createQuote(form);
      }
      handleCancel();
      fetchQuotes();
    } catch (err: any) {
      setSaveError(err?.response?.data?.message ?? err?.message ?? 'Failed to save quote');
    }
  };

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="page-title-row">
          <button className="back-btn" onClick={() => navigate('/admin')}>← Back</button>
          <h1>Quote Management</h1>
        </div>
      </header>

      <div className="controls">
        <input
          placeholder="Search by text or author"
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
            <option value="author">Author</option>
          </select>
        </label>
        <select value={sortDirection} onChange={e => setSortDirection(e.target.value as 'asc' | 'desc')}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <button className="action-btn" onClick={openNew}>+ New Quote</button>
      </div>

      <div className="list">
        {loading ? (
          <p className="loading-msg">Loading...</p>
        ) : quotes.length === 0 ? (
          <p className="empty-msg">No quotes found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Quote</th>
                <th>Author</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.id}>
                  <td className="cell-quote" title={q.text}>{q.text}</td>
                  <td>{q.author}</td>
                  <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-cell">
                      <button className="btn-sm" onClick={() => handleEdit(q)}>Edit</button>
                      <button className="btn-sm btn-danger" onClick={() => handleDelete(q.id)}>Delete</button>
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
            <h3>{editing ? 'Edit Quote' : 'New Quote'}</h3>
            {saveError && <p className="form-error">{saveError}</p>}
            <div className="form-field">
              <label>Quote Text</label>
              <textarea
                value={form.text}
                onChange={e => setForm({ ...form, text: e.target.value })}
                placeholder="Enter the famous quote"
                rows={3}
                autoFocus
              />
            </div>
            <div className="form-field">
              <label>Author</label>
              <input
                value={form.author}
                onChange={e => setForm({ ...form, author: e.target.value })}
                placeholder="e.g. Winston Churchill"
              />
            </div>
            <div className="editor-actions">
              <button onClick={handleSave}>{editing ? 'Save Changes' : 'Create Quote'}</button>
              <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteManagement;
