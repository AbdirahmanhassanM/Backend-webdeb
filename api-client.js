// API Client for Are You Dumb Quiz Application

const API_URL = 'http://localhost:3000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Something went wrong');
  }
  return response.json();
};

// Authentication API
export const authAPI = {
  // Register a new user
  signup: async (userData) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },
};

// Quiz API
export const quizAPI = {
  // Get all quizzes
  getAllQuizzes: async (token) => {
    const response = await fetch(`${API_URL}/quiz`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Get quiz by ID
  getQuizById: async (quizId, token) => {
    const response = await fetch(`${API_URL}/quiz/${quizId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Submit quiz answer
  submitAnswer: async (quizId, answer, token) => {
    const response = await fetch(`${API_URL}/quiz/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ answer }),
    });
    return handleResponse(response);
  },

  // Create new quiz (admin only)
  createQuiz: async (quizData, token) => {
    const response = await fetch(`${API_URL}/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(quizData),
    });
    return handleResponse(response);
  },
}; 