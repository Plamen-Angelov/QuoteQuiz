import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useApi';
import { useQuizLogic } from '../hooks/useQuizLogic';
import '../styles/StartScreen.css';

const StartScreen: React.FC = () => {
  const navigate = useNavigate();
  const { users, isLoading, error } = useUsers();
  const { setUserId, setUsername } = useQuizLogic();
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const activeUsers = useMemo(() => {
    return users.filter(u => u.isActive);
  }, [users]);

  const handleStartQuiz = () => {
    if (!selectedUserId) {
      alert('Please select a user');
      return;
    }
    const user = activeUsers.find(u => u.id === selectedUserId);
    setUserId(selectedUserId);
    setUsername(user?.username ?? selectedUserId);
    navigate('/quiz');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleAdmin = () => {
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="start-screen">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="start-screen">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="start-screen">
      <header className="app-header">
        <h1>🎯 Famous Quote Quiz</h1>
        <div className="header-actions">
          <button className="settings-btn" onClick={handleSettings} aria-label="Go to settings">
            ⚙️ Settings
          </button>
          <button className="admin-btn" onClick={handleAdmin} aria-label="Go to admin panel">
            🔧 Admin
          </button>
        </div>
      </header>

      <div className="start-container">
        <div className="welcome-section">
          <h2>Welcome to the Famous Quote Quiz!</h2>
          <p>Test your knowledge of famous quotes and their authors.</p>
        </div>

        <div className="user-selection">
          <label htmlFor="user-select">Select Your Username:</label>
          <select
            id="user-select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="user-dropdown"
            aria-label="Select a user"
          >
            <option value="">-- Choose a user --</option>
            {activeUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <button
          className="start-btn"
          onClick={handleStartQuiz}
          disabled={!selectedUserId}
          aria-label="Start quiz"
        >
          Start Quiz →
        </button>

        <div className="info-section">
          <p>📝 Instructions:</p>
          <ul>
            <li>Answer questions about famous quotes</li>
            <li>Guess the correct author</li>
            <li>Your answers will be recorded</li>
            <li>You can end the quiz anytime</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
