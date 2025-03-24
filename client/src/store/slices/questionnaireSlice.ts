// Імпортуємо необхідні функції з Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Імпортуємо сервіс для роботи з API
import { questionnaireService } from '../../services/api';
import { editQuestionnaireService } from '../../services/editQuestionnaireService';
// Імпортуємо типи
import { Questionnaire } from '../../types';

// Визначаємо інтерфейс для стану опитувань
interface QuestionnaireState {
  questionnaires: Questionnaire[]; // Масив опитувань
  currentQuestionnaire: Questionnaire | null;
  loading: boolean; // Статус завантаження
  error: string | null; // Помилка, якщо є
}

// Визначаємо початковий стан
const initialState: QuestionnaireState = {
  questionnaires: [], // Порожній масив опитувань
  currentQuestionnaire: null,
  loading: false, // Початково не завантажуємо
  error: null, // Початково немає помилок
};

// Створюємо асинхронний thunk для отримання всіх опитувань
export const fetchQuestionnaires = createAsyncThunk(
  'questionnaires/fetchAll', // Унікальний ідентифікатор дії
  async () => {
    const response = await questionnaireService.getAll();
    return response;
  }
);

export const fetchQuestionnaireById = createAsyncThunk(
  'questionnaires/fetchById',
  async (id: string) => {
    const response = await editQuestionnaireService.getQuestionnaireById(id);
    return response;
  }
);

// Створюємо асинхронний thunk для створення опитування
export const createQuestionnaire = createAsyncThunk(
  'questionnaires/create',
  async (data: Omit<Questionnaire, '_id'>) => {
    const response = await questionnaireService.create(data);
    return response;
  }
);

export const updateQuestionnaire = createAsyncThunk(
  'questionnaires/update',
  async ({ id, data }: { id: string; data: Partial<Questionnaire> }) => {
    const response = await editQuestionnaireService.updateQuestionnaire(id, data);
    return response;
  }
);

export const deleteQuestionnaire = createAsyncThunk(
  'questionnaires/delete',
  async (id: string) => {
    await editQuestionnaireService.deleteQuestionnaire(id);
    return id;
  }
);

// Створюємо slice для опитувань
const questionnaireSlice = createSlice({
  name: 'questionnaires', // Назва slice
  initialState, // Початковий стан
  reducers: {
    clearCurrentQuestionnaire: (state) => {
      state.currentQuestionnaire = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обробка початку завантаження
      .addCase(fetchQuestionnaires.pending, (state) => {
        state.loading = true; // Встановлюємо статус завантаження
        state.error = null; // Очищуємо попередні помилки
      })
      // Обробка успішного завантаження
      .addCase(fetchQuestionnaires.fulfilled, (state, action) => {
        state.loading = false; // Завершуємо завантаження
        state.questionnaires = action.payload;
      })
      // Обробка помилки завантаження
      .addCase(fetchQuestionnaires.rejected, (state, action) => {
        state.loading = false; // Завершуємо завантаження
        state.error = action.error.message || 'Помилка при отриманні опитувань'; // Встановлюємо помилку
      })
      .addCase(fetchQuestionnaireById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionnaireById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuestionnaire = action.payload;
      })
      .addCase(fetchQuestionnaireById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Помилка при отриманні опитування';
      })
      // Обробка створення опитування
      .addCase(createQuestionnaire.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestionnaire.fulfilled, (state, action) => {
        state.loading = false;
        state.questionnaires.push(action.payload);
      })
      .addCase(createQuestionnaire.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Помилка при створенні опитування';
      })
      // Update Questionnaire
      .addCase(updateQuestionnaire.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuestionnaire.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.questionnaires.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          state.questionnaires[index] = action.payload;
        }
        if (state.currentQuestionnaire?._id === action.payload._id) {
          state.currentQuestionnaire = action.payload;
        }
      })
      .addCase(updateQuestionnaire.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Помилка при оновленні опитування';
      })
      // Delete questionnaire
      .addCase(deleteQuestionnaire.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuestionnaire.fulfilled, (state, action) => {
        state.loading = false;
        state.questionnaires = state.questionnaires.filter(q => q._id !== action.payload);
        if (state.currentQuestionnaire?._id === action.payload) {
          state.currentQuestionnaire = null;
        }
      })
      .addCase(deleteQuestionnaire.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Помилка при видаленні опитування';
      });
  },
});

export const { clearCurrentQuestionnaire } = questionnaireSlice.actions;

// Експортуємо редюсер
export default questionnaireSlice.reducer;