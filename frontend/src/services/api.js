import axios from 'axios';

// API base URL - updated to match backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for AI responses
});

// API service methods
export const medicalAPI = {
  // Check API health
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Get medical advice
  getMedicalAdvice: async (question, age = null, gender = null) => {
    const response = await api.post('/advice', {
      question,
      age,
      gender,
    });
    return response.data;
  },

  // Get query history
  getHistory: async (limit = 50, offset = 0) => {
    const response = await api.get('/history', {
      params: { limit, offset },
    });
    return response.data;
  },

  // Get specific query by ID
  getQueryById: async (id) => {
    const response = await api.get(`/history/${id}`);
    return response.data;
  },
};

export default api;
