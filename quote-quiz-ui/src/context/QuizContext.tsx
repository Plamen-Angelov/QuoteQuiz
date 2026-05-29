import React, { createContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { QuizState, QuizMode, QuizAnswer, Quote } from '../types';

// Initial state
const initialState: QuizState = {
  userId: null,
  username: null,
  currentQuote: null,
  mode: 'binary',
  isAnswered: false,
  selectedAnswer: null,
  isCorrect: null,
  answers: [],
  isLoading: false,
  error: null,
};

// Action types
export type QuizAction =
  | { type: 'SET_USER_ID'; payload: string }
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_MODE'; payload: QuizMode }
  | { type: 'SET_QUOTE'; payload: Quote }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ANSWER_QUESTION'; payload: { selectedAnswer: string; isCorrect: boolean } }
  | { type: 'ADD_ANSWER'; payload: QuizAnswer }  // QuizAnswer now includes suggestedOptions
  | { type: 'RESET_QUESTION' }
  | { type: 'END_QUIZ' }
  | { type: 'RESET_QUIZ' };

// Reducer function
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };

    case 'SET_USERNAME':
      return { ...state, username: action.payload };

    case 'SET_MODE':
      return { ...state, mode: action.payload };

    case 'SET_QUOTE':
      return {
        ...state,
        currentQuote: action.payload,
        isAnswered: false,
        selectedAnswer: null,
        isCorrect: null,
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'ANSWER_QUESTION':
      return {
        ...state,
        selectedAnswer: action.payload.selectedAnswer,
        isCorrect: action.payload.isCorrect,
        isAnswered: true,
      };

    case 'ADD_ANSWER':
      return {
        ...state,
        answers: [...state.answers, action.payload],
      };

    case 'RESET_QUESTION':
      return {
        ...state,
        currentQuote: null,
        isAnswered: false,
        selectedAnswer: null,
        isCorrect: null,
      };

    case 'END_QUIZ':
      return {
        ...state,
        userId: null,
        username: null,
        currentQuote: null,
        isAnswered: false,
        selectedAnswer: null,
        isCorrect: null,
        answers: [],
      };

    case 'RESET_QUIZ':
      return initialState;

    default:
      return state;
  }
}

// Context
interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
}

export const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Provider
interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};
