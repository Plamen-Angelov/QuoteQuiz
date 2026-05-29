import React, { useMemo, useState } from 'react';
import type { Quote } from '../types';
import '../styles/MultipleChoiceMode.css';

interface MultipleChoiceModeProps {
  quote: Quote;
  onAnswer: (selectedAnswer: string, isCorrect: boolean, suggestedOptions: string) => void;
}

const MultipleChoiceMode: React.FC<MultipleChoiceModeProps> = ({ quote, onAnswer }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const options = useMemo(() => {
    // Parse the comma-separated answers
    const answers = quote.answers.split(',').map(a => a.trim());
    return answers;
  }, [quote.answers]);

  const handleAnswer = (selectedAnswer: string) => {
    setIsProcessing(true);
    const isCorrect = selectedAnswer === quote.correctAnswer;
    // Pass all options as suggestedOptions so achievements can show what was presented
    onAnswer(selectedAnswer, isCorrect, quote.answers);
  };

  return (
    <div className="multiple-choice-mode">
      <p className="label">Choose the correct author:</p>
      <div className="options-group">
        {options.map((option, index) => (
          <button
            key={index}
            className="option-btn"
            onClick={() => handleAnswer(option)}
            disabled={isProcessing}
            aria-label={`Answer: ${option}`}
          >
            → {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceMode;
