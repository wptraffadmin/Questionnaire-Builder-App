import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { answersService } from '../../services/answersService';

interface QuestionnaireStats {
  totalResponses: number;
  questionsCount: number;
}

interface AnswersState {
  loading: boolean;
  error: string | null;
  submittedAnswers: Record<string, Record<string, string | string[]>>;
  questionnaireStats: Record<string, QuestionnaireStats>;
}

const initialState: AnswersState = {
  loading: false,
  error: null,
  submittedAnswers: {},
  questionnaireStats: {},
};

export const submitAnswers = createAsyncThunk(
  'answers/submit',
  async ({ questionnaireId, answers }: { questionnaireId: string; answers: Record<string, string | string[]> }) => {
    await answersService.submitAnswers(questionnaireId, answers);
    return { questionnaireId, answers };
  }
);

export const fetchAnswers = createAsyncThunk(
  'answers/fetch',
  async (questionnaireId: string) => {
    const answers = await answersService.getAnswers(questionnaireId);
    return { questionnaireId, answers };
  }
);

export const fetchAllAnswers = createAsyncThunk(
  'answers/fetchAll',
  async () => {
    const answers = await answersService.getAllAnswers();
    return answers;
  }
);

export const fetchQuestionnaireStats = createAsyncThunk(
  'answers/fetchStats',
  async (questionnaireId: string) => {
    const stats = await answersService.getQuestionnaireStats(questionnaireId);
    return { questionnaireId, stats };
  }
);

const answersSlice = createSlice({
  name: 'answers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.submittedAnswers[action.payload.questionnaireId] = action.payload.answers;
      })
      .addCase(submitAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Помилка при відправці відповідей';
      })
      .addCase(fetchAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.submittedAnswers[action.payload.questionnaireId] = action.payload.answers;
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Помилка при отриманні відповідей';
      })
      .addCase(fetchAllAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.submittedAnswers = action.payload;
      })
      .addCase(fetchAllAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Помилка при отриманні всіх відповідей';
      })
      .addCase(fetchQuestionnaireStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionnaireStats.fulfilled, (state, action) => {
        state.loading = false;
        state.questionnaireStats[action.payload.questionnaireId] = action.payload.stats;
      })
      .addCase(fetchQuestionnaireStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Помилка при отриманні статистики';
      });
  },
});

export default answersSlice.reducer; 