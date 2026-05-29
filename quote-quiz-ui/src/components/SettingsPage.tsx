import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizLogic } from '../hooks/useQuizLogic';
import '../styles/SettingsPage.css';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setMode } = useQuizLogic();

  const handleModeChange = (newMode: 'binary' | 'multiple') => {
    setMode(newMode);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button
          className="back-btn"
          onClick={handleBack}
          aria-label="Go back"
        >
          ← Back
        </button>
        <h1>⚙️ Settings</h1>
      </header>

      <div className="settings-container">
        <div className="settings-section">
          <h2>Quiz Mode</h2>
          <p className="section-description">Choose how you want to play:</p>

          <div className="mode-options">
            <label className={`mode-option ${state.mode === 'binary' ? 'active' : ''}`}>
              <input
                type="radio"
                name="mode"
                value="binary"
                checked={state.mode === 'binary'}
                onChange={() => handleModeChange('binary')}
                aria-label="Binary mode"
              />
              <span className="mode-title">Binary Mode (Yes/No)</span>
              <span className="mode-description">
                You'll be shown an author name and answer if it's correct or not.
              </span>
            </label>

            <label className={`mode-option ${state.mode === 'multiple' ? 'active' : ''}`}>
              <input
                type="radio"
                name="mode"
                value="multiple"
                checked={state.mode === 'multiple'}
                onChange={() => handleModeChange('multiple')}
                aria-label="Multiple choice mode"
              />
              <span className="mode-title">Multiple Choice Mode</span>
              <span className="mode-description">
                You'll choose the correct author from 3 options.
              </span>
            </label>
          </div>
        </div>

        <div className="settings-section info-section">
          <h3>📖 How to Play</h3>
          <ul>
            <li>Read the famous quote</li>
            <li>In Binary mode: Answer if the suggested author is correct</li>
            <li>In Multiple choice mode: Choose the correct author from 3 options</li>
            <li>See immediate feedback on your answer</li>
            <li>Continue to the next quote</li>
            <li>End quiz anytime to save your score</li>
          </ul>
        </div>

        <div className="settings-section info-section">
          <h3>🎯 Tips</h3>
          <ul>
            <li>Read the quote carefully</li>
            <li>Think about the author's style and time period</li>
            <li>Your answers are tracked for your achievements</li>
            <li>Try both modes to find your preference</li>
          </ul>
        </div>

        <button className="back-btn main" onClick={handleBack}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
