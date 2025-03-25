import axios from 'axios';

// Отримуємо базовий URL із змінної середовища
let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Перевіряємо, чи містить URL вже /api, якщо ні - додаємо
if (!baseURL.endsWith('/api')) {
  baseURL = `${baseURL}/api`;
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface QuestionnaireStats {
  totalResponses: number;
  questionsCount: number;
}

export const answersService = {
  // Відправити відповіді на опитування
  submitAnswers: async (questionnaireId: string, answers: Record<string, string | string[]>): Promise<void> => {
    await api.post(`/answers/${questionnaireId}`, { answers });
  },

  // Отримати відповіді для конкретного опитування
  getAnswers: async (questionnaireId: string): Promise<Record<string, string | string[]>> => {
    const response = await api.get(`/answers/${questionnaireId}`);
    return response.data;
  },

  // Отримати всі відповіді
  getAllAnswers: async (): Promise<Record<string, Record<string, string | string[]>>> => {
    const response = await api.get('/answers');
    return response.data;
  },

  // Отримати статистику опитування
  getQuestionnaireStats: async (questionnaireId: string): Promise<QuestionnaireStats> => {
    const response = await api.get(`/answers/stats/${questionnaireId}`);
    return response.data;
  },
}; 