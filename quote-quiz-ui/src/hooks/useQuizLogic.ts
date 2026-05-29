import { useContext, useCallback } from 'react';
import { QuizContext } from '../context/QuizContext';

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};

export const useQuizLogic = () => {
  const { state, dispatch } = useQuiz();

  const setUserId = useCallback((userId: string) => {
    dispatch({ type: 'SET_USER_ID', payload: userId });
  }, [dispatch]);

  const setUsername = useCallback((username: string) => {
    dispatch({ type: 'SET_USERNAME', payload: username });
  }, [dispatch]);

  const setMode = useCallback((mode: 'binary' | 'multiple') => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, [dispatch]);

  const setQuote = useCallback((quote: any) => {
    dispatch({ type: 'SET_QUOTE', payload: quote });
  }, [dispatch]);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, [dispatch]);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, [dispatch]);

  const answerQuestion = useCallback((selectedAnswer: string, isCorrect: boolean) => {
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { selectedAnswer, isCorrect },
    });
  }, [dispatch]);

  const addAnswer = useCallback((quoteId: string, selectedAnswer: string, suggestedOptions: string, isCorrect: boolean) => {
    dispatch({
      type: 'ADD_ANSWER',
      payload: { quoteId, selectedAnswer, suggestedOptions, isCorrect },
    });
  }, [dispatch]);

  const resetQuestion = useCallback(() => {
    dispatch({ type: 'RESET_QUESTION' });
  }, [dispatch]);

  const endQuiz = useCallback(() => {
    dispatch({ type: 'END_QUIZ' });
  }, [dispatch]);

  const resetQuiz = useCallback(() => {
    dispatch({ type: 'RESET_QUIZ' });
  }, [dispatch]);

  return {
    state,
    setUserId,
    setUsername,
    setMode,
    setQuote,
    setLoading,
    setError,
    answerQuestion,
    addAnswer,
    resetQuestion,
    endQuiz,
    resetQuiz,
  };
};
