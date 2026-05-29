import React from 'react';
import '../styles/ResultFeedback.css';

interface ResultFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
}

const ResultFeedback: React.FC<ResultFeedbackProps> = ({ isCorrect, correctAnswer }) => {
  return (
    <div className={`result-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="feedback-content">
        {isCorrect ? (
          <>
            <div className="feedback-icon">✓</div>
            <p className="feedback-message">Correct! The right answer is: <strong>{correctAnswer}</strong></p>
          </>
        ) : (
          <>
            <div className="feedback-icon">✗</div>
            <p className="feedback-message">Sorry, you are wrong! The right answer is: <strong>{correctAnswer}</strong></p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultFeedback;
