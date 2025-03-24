// Імпортуємо configureStore з Redux Toolkit для створення store
import { configureStore } from '@reduxjs/toolkit';
// Імпортуємо наш редюсер для опитувань
import questionnaireReducer from './slices/questionnaireSlice';
import answersReducer from './slices/answersSlice';

// Створюємо store з використанням configureStore
export const store = configureStore({
  reducer: {
    // Додаємо наш редюсер під ключем 'questionnaires'
    questionnaires: questionnaireReducer,
    answers: answersReducer,
  },
});

// Експортуємо тип RootState, який визначає структуру всього store
export type RootState = ReturnType<typeof store.getState>;
// Експортуємо тип AppDispatch для типізації dispatch функції
export type AppDispatch = typeof store.dispatch;