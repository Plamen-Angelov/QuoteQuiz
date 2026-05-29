import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage users - create, edit, disable, delete',
      icon: '👥',
      color: 'blue',
    },
    {
      id: 'quotes',
      title: 'Quote Management',
      description: 'Manage quotes - create, edit, delete',
      icon: '📝',
      color: 'purple',
    },
    {
      id: 'achievements',
      title: 'User Achievements',
      description: 'Review user games and performance',
      icon: '🏆',
      color: 'green',
    },
  ];

  const handleNavigate = (id: string) => {
    navigate(`/admin/${id}`);
  };

  const handleBackToQuiz = () => {
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <button className="back-to-quiz-btn" onClick={handleBackToQuiz}>
          ← Back to Quiz
        </button>
      </header>

      <div className="dashboard-container">
        <div className="menu-grid">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`menu-card ${item.color}`}
              onClick={() => handleNavigate(item.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNavigate(item.id);
                }
              }}
              aria-label={item.title}
            >
              <div className="card-icon">{item.icon}</div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
