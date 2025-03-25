import axios, { AxiosError } from 'axios';
import { Questionnaire } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Перехоплення помилок
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Сервер відповів з помилкою
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Запит був зроблений, але відповіді не отримано
      console.error('Network Error:', error.request);
      return Promise.reject({ message: 'Network error occurred' });
    } else {
      // Помилка при налаштуванні запиту
      console.error('Request Error:', error.message);
      return Promise.reject({ message: 'Request failed' });
    }
  }
);

export const questionnaireService = {
  // Отримати всі опитування
  getAll: async (): Promise<Questionnaire[]> => {
    const response = await api.get('/questionnaires');
    return response.data;
  },

  // Отримати конкретне опитування
  getById: async (id: string): Promise<Questionnaire> => {
    const response = await api.get(`/questionnaires/${id}`);
    return response.data;
  },

  // Створити нове опитування
  create: async (data: Omit<Questionnaire, '_id' | 'createdAt' | 'updatedAt'>): Promise<Questionnaire> => {
    const response = await api.post('/questionnaires', data);
    return response.data;
  },

  // Оновити опитування
  update: async (id: string, data: Partial<Questionnaire>): Promise<Questionnaire> => {
    const response = await api.put(`/questionnaires/${id}`, data);
    return response.data;
  },

  // Видалити опитування
  delete: async (id: string): Promise<void> => {
    await api.delete(`/questionnaires/${id}`);
  },
}; 