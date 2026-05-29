// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

// Quote Types
export interface Quote {
  id: string;
  text: string;
  author: string;
  answers: string; // comma-separated string of 3 answers
  correctAnswer: string;
}

// Quiz Answer Types
export interface QuizAnswer {
  quoteId: string;
  selectedAnswer: string;
  suggestedOptions: string;
  isCorrect: boolean;
}

// Matches backend SaveGameDto / GameAnswerSubmissionDto exactly
export interface GameAnswerSubmission {
  quoteId: string;
  selectedAnswer: string;
  suggestedOptions: string;
  isCorrect: boolean;
}

export interface QuizGame {
  userId: string;
  answers: GameAnswerSubmission[];
}

// Quiz Mode Types
export type QuizMode = 'binary' | 'multiple';

// Quiz State Types
export interface QuizState {
  userId: string | null;
  username: string | null;
  currentQuote: Quote | null;
  mode: QuizMode;
  isAnswered: boolean;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  answers: QuizAnswer[];
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
