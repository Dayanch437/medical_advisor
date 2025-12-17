import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://213.21.235.119:8002';

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

const getCacheKey = (url, params) => {
  return `${url}_${JSON.stringify(params)}`;
};

const getFromCache = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
  if (cache.size > 100) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const medicalAPI = {
  checkHealth: async () => {
    const cacheKey = getCacheKey('/health', {});
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    const response = await api.get('/health');
    setCache(cacheKey, response.data);
    return response.data;
  },

  getMedicalAdvice: async (question, age = null, gender = null) => {
    const response = await api.post('/advice', {
      question,
      age,
      gender,
    });
    return response.data;
  },

  getHistory: async (limit = 50, offset = 0) => {
    const cacheKey = getCacheKey('/history', { limit, offset });
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    const response = await api.get('/history', {
      params: { limit, offset },
    });
    setCache(cacheKey, response.data);
    return response.data;
  },

  getQueryById: async (id) => {
    const cacheKey = getCacheKey(`/history/${id}`, {});
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    const response = await api.get(`/history/${id}`);
    setCache(cacheKey, response.data);
    return response.data;
  },

  clearCache: () => {
    cache.clear();
  },
};

export default api;
