import { useState, useEffect } from 'react';
import type { User, Quote } from '../types';
import apiService from '../services/apiService';

/**
 * Hook to fetch users from API
 */
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiService.getUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, isLoading, error };
};

/**
 * Hook to fetch a random quote from API
 */
export const useRandomQuote = (shouldFetch: boolean = true) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldFetch) {
      setIsLoading(false);
      return;
    }

    const fetchQuote = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiService.getRandomQuote();
        setQuote(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quote');
        console.error('Error fetching quote:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, [shouldFetch]);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getRandomQuote();
      setQuote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote');
      console.error('Error refetching quote:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { quote, isLoading, error, refetch };
};

/**
 * Hook to save quiz game to API
 */
export const useSaveQuizGame = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (quizGame: any) => {
    try {
      setIsSaving(true);
      setError(null);
      const result = await apiService.saveQuizGame(quizGame);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save quiz game';
      setError(errorMsg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return { save, isSaving, error };
};
