import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import '../styles/AdminManagement.css';

interface User {
  id: string;
  username: string;
  isActive: boolean;
}

// Shape returned by GET /api/games/user/{userId}
interface GameQuestionAnswerDto {
  quoteId: string;
  quoteText: string;
  author: string;
  selectedAnswer: string;
  suggestedOptions: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface UserGameHistoryDto {
  gameId: string;          // NOT "id"
  playedAt: string;        // NOT "createdAt"
  totalQuestions: number;
  correctAnswers: number;
  accuracyPercentage: number;
  questions: GameQuestionAnswerDto[];  // NOT "quizAnswers"
}

interface AchievementRow {
  gameId: string;
  gameDate: string;
  userId: string;
  username: string;
  quoteId: string;
  quoteText: string;
  suggestedOptions: string;
  correctAnswer: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

const PAGE_SIZES = [10, 25, 50];

const UserAchievements: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [allRows, setAllRows] = useState<AchievementRow[]>([]);
  const [loading, setLoading] = useState(false);

  // filters / sort
  const [selectedUserId, setSelectedUserId] = useState('');
  const [filterResult, setFilterResult] = useState<'all' | 'correct' | 'wrong'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'username'>('date');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Load all users then all their games in parallel on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const usersData = await apiService.getUsers();
        const userList: User[] = Array.isArray(usersData) ? usersData : [];
        setUsers(userList);

        const results = await Promise.all(
          userList.map(u =>
            apiService.getUserGameHistory(u.id)
              .then(data => ({ userId: u.id, username: u.username, data }))
              .catch(() => ({ userId: u.id, username: u.username, data: [] }))
          )
        );

        const rows: AchievementRow[] = [];
        for (const { userId, username, data } of results) {
          const games: UserGameHistoryDto[] = Array.isArray(data) ? data : [];
          for (const game of games) {
            for (const q of (game.questions ?? [])) {
              rows.push({
                gameId: game.gameId,
                gameDate: game.playedAt,
                userId,
                username,
                quoteId: q.quoteId,
                quoteText: q.quoteText,
                suggestedOptions: q.suggestedOptions ?? '',
                correctAnswer: q.correctAnswer,
                selectedAnswer: q.selectedAnswer,
                isCorrect: q.isCorrect,
              });
            }
          }
        }
        setAllRows(rows);
      } catch {
        console.error('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredRows = useMemo(() => {
    let rows = allRows;
    if (selectedUserId) rows = rows.filter(r => r.userId === selectedUserId);
    if (filterResult === 'correct') rows = rows.filter(r => r.isCorrect);
    if (filterResult === 'wrong') rows = rows.filter(r => !r.isCorrect);
    return [...rows].sort((a, b) => {
      if (sortBy === 'username') {
        const cmp = a.username.localeCompare(b.username);
        return sortDir === 'asc' ? cmp : -cmp;
      }
      const diff = new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime();
      return sortDir === 'desc' ? -diff : diff;
    });
  }, [allRows, selectedUserId, filterResult, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const setFilter = (userId: string) => { setSelectedUserId(userId); setPage(1); };
  const setResult = (v: 'all' | 'correct' | 'wrong') => { setFilterResult(v); setPage(1); };
  const setSort = (by: 'date' | 'username') => { setSortBy(by); setPage(1); };
  const setDir = (d: 'asc' | 'desc') => { setSortDir(d); setPage(1); };

  const correctCount = filteredRows.filter(r => r.isCorrect).length;
  const pct = filteredRows.length > 0
    ? Math.round((correctCount / filteredRows.length) * 100)
    : null;

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="page-title-row">
          <button className="back-btn" onClick={() => navigate('/admin')}>← Back</button>
          <h1>User Achievements</h1>
        </div>
      </header>

      <div className="controls">
        <label>User:
          <select value={selectedUserId} onChange={e => setFilter(e.target.value)} disabled={loading}>
            <option value="">All users</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.username}{!u.isActive ? ' (inactive)' : ''}
              </option>
            ))}
          </select>
        </label>

        <label>Result:
          <select value={filterResult} onChange={e => setResult(e.target.value as any)}>
            <option value="all">All</option>
            <option value="correct">Correct only</option>
            <option value="wrong">Wrong only</option>
          </select>
        </label>

        <label>Sort by:
          <select value={sortBy} onChange={e => setSort(e.target.value as any)}>
            <option value="date">Date</option>
            <option value="username">Username</option>
          </select>
        </label>

        <select value={sortDir} onChange={e => setDir(e.target.value as any)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>

        <label>Per page:
          <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
            {PAGE_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>

        {!loading && filteredRows.length > 0 && (
          <span className="row-count">
            {filteredRows.length} answer{filteredRows.length !== 1 ? 's' : ''}
            {pct !== null && ` · ${pct}% correct`}
          </span>
        )}
      </div>

      <div className="list">
        {loading ? (
          <p className="loading-msg">Loading achievements…</p>
        ) : filteredRows.length === 0 ? (
          <p className="empty-msg">No achievements found.</p>
        ) : (
          <table className="achievements-table">
            <colgroup>
              <col className="col-username" />
              <col className="col-quote" />
              <col className="col-suggested" />
              <col className="col-answer" />
              <col className="col-correct" />
              <col className="col-result" />
              <col className="col-date" />
            </colgroup>
            <thead>
              <tr>
                <th>Username</th>
                <th>Quote</th>
                <th>Suggested</th>
                <th>User's Answer</th>
                <th>Correct Answer</th>
                <th>Result</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, idx) => (
                <tr key={`${row.gameId}-${idx}`}>
                  <td><strong>{row.username}</strong></td>
                  <td className="cell-quote" title={row.quoteText}>{row.quoteText}</td>
                  <td>{row.suggestedOptions
                    ? row.suggestedOptions.split(',').map(a => a.trim()).join(', ')
                    : '—'}
                  </td>
                  <td>{row.selectedAnswer}</td>
                  <td>{row.correctAnswer}</td>
                  <td>
                    {row.isCorrect
                      ? <span className="result-icon correct">✓</span>
                      : <span className="result-icon wrong">✗</span>}
                  </td>
                  <td className="date-cell">{new Date(row.gameDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && filteredRows.length > 0 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <span>Page {page} of {totalPages} ({filteredRows.length} rows)</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default UserAchievements;
