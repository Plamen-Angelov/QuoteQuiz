import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { User, Quote, QuizGame } from '../types';
// QuizGame now matches SaveGameDto: { userId, answers: [{ quoteId, selectedAnswer }] }

const API_BASE_URL = 'http://localhost:5154/api'; // Update with your backend URL

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Error interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get list of all users
   */
  async getUsers(): Promise<User[]> {
    try {
      const response = await this.api.get<any>('/users', {
        params: { pageNumber: 1, pageSize: 1000 },
      });
      const data = response.data;
      return Array.isArray(data) ? data : (data.items ?? []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  /**
   * Get a random quote
   */
  async getRandomQuote(): Promise<Quote> {
    try {
      const response = await this.api.get<Quote>('/quotes/random');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch random quote:', error);
      throw error;
    }
  }

  /**
   * Save quiz game with all answers
   */
  async saveQuizGame(quizGame: QuizGame): Promise<{ id: string }> {
    try {
      const response = await this.api.post<{ id: string }>('/games', quizGame);
      return response.data;
    } catch (error) {
      console.error('Failed to save quiz game:', error);
      throw error;
    }
  }

  // ===== ADMIN ENDPOINTS =====

  /**
   * Get paginated and filtered user list
   */
  async getUsersPaginated(
    searchText?: string,
    pageNumber: number = 1,
    pageSize: number = 10,
    sortBy: string = 'CreatedAt',
    sortDirection: string = 'desc'
  ): Promise<any> {
    try {
      const response = await this.api.get('/users', {
        params: {
          searchText,
          pageNumber,
          pageSize,
          sortBy,
          sortDirection,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch paginated users:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: any): Promise<any> {
    try {
      const response = await this.api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(userId: string, userData: any): Promise<any> {
    try {
      const response = await this.api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<any> {
    try {
      const response = await this.api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }

  /**
   * Get paginated and filtered quote list
   */
  async getQuotesPaginated(
    searchText?: string,
    pageNumber: number = 1,
    pageSize: number = 10,
    sortBy: string = 'CreatedAt',
    sortDirection: string = 'desc'
  ): Promise<any> {
    try {
      const response = await this.api.get('/quotes', {
        params: {
          searchText,
          pageNumber,
          pageSize,
          sortBy,
          sortDirection,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch paginated quotes:', error);
      throw error;
    }
  }

  /**
   * Create a new quote
   */
  async createQuote(quoteData: any): Promise<any> {
    try {
      const response = await this.api.post('/quotes', quoteData);
      return response.data;
    } catch (error) {
      console.error('Failed to create quote:', error);
      throw error;
    }
  }

  /**
   * Update quote
   */
  async updateQuote(quoteId: string, quoteData: any): Promise<any> {
    try {
      const response = await this.api.put(`/quotes/${quoteId}`, quoteData);
      return response.data;
    } catch (error) {
      console.error('Failed to update quote:', error);
      throw error;
    }
  }

  /**
   * Delete quote
   */
  async deleteQuote(quoteId: string): Promise<any> {
    try {
      const response = await this.api.delete(`/quotes/${quoteId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete quote:', error);
      throw error;
    }
  }

  /**
   * Get user game history
   */
  async getUserGameHistory(userId: string): Promise<any> {
    try {
      const response = await this.api.get(`/games/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user game history:', error);
      throw error;
    }
  }
}

export default new ApiService();
