import React, { useMemo, useState } from 'react';
import type { Quote } from '../types';
import '../styles/BinaryMode.css';

interface BinaryModeProps {
  quote: Quote;
  onAnswer: (selectedAnswer: string, isCorrect: boolean, suggestedOptions: string) => void;
}

const BinaryMode: React.FC<BinaryModeProps> = ({ quote, onAnswer }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // The backend puts 2 wrong authors + 1 correct into quote.answers (shuffled).
  // If the DB has too few distinct authors the wrong-answer pool is empty and
  // Answers contains only the correct author — binary mode would be trivially
  // "Yes always correct". We detect this and show a notice instead.
  const { suggestedAuthor, canAsk } = useMemo(() => {
    const options = quote.answers.split(',').map(a => a.trim()).filter(Boolean);
    const hasWrongOptions = options.some(o => o !== quote.correctAnswer);
    if (options.length === 0 || !hasWrongOptions) {
      return { suggestedAuthor: quote.correctAnswer, canAsk: false };
    }
    const picked = options[Math.floor(Math.random() * options.length)];
    return { suggestedAuthor: picked, canAsk: true };
  }, [quote.id]);

  const isYesCorrect = suggestedAuthor === quote.correctAnswer;

  const handleAnswer = (answer: 'Yes' | 'No') => {
    setIsProcessing(true);
    const isCorrect = (answer === 'Yes') === isYesCorrect;
    onAnswer(answer, isCorrect, suggestedAuthor);
  };

  if (!canAsk) {
    return (
      <div className="binary-mode">
        <div className="suggested-answer" style={{ borderColor: 'var(--warning-color)' }}>
          <p className="label" style={{ color: 'var(--warning-color)' }}>
            Not enough distinct authors in the database to generate a Yes/No question.
            Please add more quotes with different authors.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="binary-mode">
      <div className="suggested-answer">
        <p className="label">Is this the author?</p>
        <p className="author-name">{suggestedAuthor}?</p>
      </div>

      <div className="button-group">
        <button
          className="answer-btn yes-btn"
          onClick={() => handleAnswer('Yes')}
          disabled={isProcessing}
          aria-label="Answer Yes"
        >
          ✓ Yes
        </button>
        <button
          className="answer-btn no-btn"
          onClick={() => handleAnswer('No')}
          disabled={isProcessing}
          aria-label="Answer No"
        >
          ✗ No
        </button>
      </div>
    </div>
  );
};

export default BinaryMode;
