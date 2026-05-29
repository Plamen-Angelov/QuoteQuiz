import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizLogic } from '../hooks/useQuizLogic';
import { useRandomQuote, useSaveQuizGame } from '../hooks/useApi';
import BinaryMode from './BinaryMode';
import MultipleChoiceMode from './MultipleChoiceMode';
import ResultFeedback from './ResultFeedback';
import '../styles/QuizPage.css';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setQuote, setLoading, setError, answerQuestion, addAnswer, resetQuestion, endQuiz } = useQuizLogic();
  const { quote, refetch } = useRandomQuote(false);
  const { save: saveQuizGame, isSaving } = useSaveQuizGame();
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);

  // Redirect to start if no user selected
  useEffect(() => {
    if (!state.userId) {
      navigate('/');
    }
  }, [state.userId, navigate]);

  // Fetch initial quote
  useEffect(() => {
    if (!quote && !state.currentQuote) {
      const fetchQuote = async () => {
        try {
          setLoading(true);
          await refetch();
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch quote');
        } finally {
          setLoading(false);
        }
      };
      fetchQuote();
    }
  }, []);

  // Update state when quote is fetched
  useEffect(() => {
    if (quote && !state.currentQuote) {
      setQuote(quote);
    }
  }, [quote, state.currentQuote, setQuote]);

  const handleAnswer = (selectedAnswer: string, isCorrect: boolean, suggestedOptions: string) => {
    if (state.currentQuote) {
      answerQuestion(selectedAnswer, isCorrect);
      addAnswer(state.currentQuote.id, selectedAnswer, suggestedOptions, isCorrect);
      setShowFeedback(true);
    }
  };

  const handleNext = async () => {
    resetQuestion();
    setShowFeedback(false);
    setQuestionNumber(n => n + 1);
    try {
      setLoading(true);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch next quote');
    } finally {
      setLoading(false);
    }
  };

  const handleEndQuiz = async () => {
    try {
      setLoading(true);
      const quizGame = {
        userId: state.userId,
        answers: state.answers.map(a => ({
          quoteId: a.quoteId,
          selectedAnswer: a.selectedAnswer,
          suggestedOptions: a.suggestedOptions,
          isCorrect: a.isCorrect,
        })),
      };

      await saveQuizGame(quizGame);
      endQuiz();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save quiz');
      alert('Failed to save quiz. Your data may not be recorded.');
    } finally {
      setLoading(false);
    }
  };

  if (!state.userId) {
    return null;
  }

  if (state.isLoading && !state.currentQuote) {
    return (
      <div className="quiz-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading quote...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="quiz-page">
        <div className="error-container">
          <p className="error-message">Error: {state.error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!state.currentQuote) {
    return (
      <div className="quiz-page">
        <div className="error-container">
          <p>No quote available. Please try again.</p>
          <button onClick={handleEndQuiz} className="end-quiz-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <button
          className="back-btn"
          onClick={handleEndQuiz}
          aria-label="End quiz"
          title="End quiz and go back"
        >
          ← Back
        </button>
        <h1>Quote Quiz</h1>
        <div className="quiz-stats">
          <span>User: <strong>{state.username ?? state.userId}</strong></span>
          <span>Mode: <strong>{state.mode.toUpperCase()}</strong></span>
          <span>Question: <strong>{questionNumber}</strong></span>
          <span>Score: <strong>{state.answers.filter(a => a.isCorrect).length}</strong></span>
        </div>
      </header>

      <div className="quiz-container">
        <div className="quote-card">
          <h2>Who Said It?</h2>
          <div className="quote-text">"{state.currentQuote.text}"</div>

          {!state.isAnswered && !showFeedback ? (
            <>
              {state.mode === 'binary' ? (
                <BinaryMode quote={state.currentQuote} onAnswer={handleAnswer} />
              ) : (
                <MultipleChoiceMode quote={state.currentQuote} onAnswer={handleAnswer} />
              )}
            </>
          ) : null}

          {showFeedback && (
            <>
              <ResultFeedback
                isCorrect={state.isCorrect || false}
                correctAnswer={state.currentQuote.author}
              />
              <div className="button-group">
                <button
                  className="next-btn"
                  onClick={handleNext}
                  disabled={state.isLoading}
                  aria-label="Next quote"
                >
                  {state.isLoading ? 'Loading...' : 'Next →'}
                </button>
                <button
                  className="end-quiz-btn"
                  onClick={handleEndQuiz}
                  disabled={isSaving}
                  aria-label="End quiz"
                >
                  {isSaving ? 'Saving...' : 'End Quiz'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
