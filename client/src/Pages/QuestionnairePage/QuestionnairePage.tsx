import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchQuestionnaireById } from '../../store/slices/questionnaireSlice';
import QuestionnaireForm from '../../components/QuestionnaireForm/QuestionnaireForm';
import './QuestionnairePage.css';

const QuestionnairePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentQuestionnaire, loading, error } = useSelector(
    (state: RootState) => state.questionnaires
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchQuestionnaireById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!currentQuestionnaire) {
    return <div className="error">Опитування не знайдено</div>;
  }

  return (
    <div className="questionnaire-page">
      <QuestionnaireForm questionnaire={currentQuestionnaire} />
    </div>
  );
};

export default QuestionnairePage;
