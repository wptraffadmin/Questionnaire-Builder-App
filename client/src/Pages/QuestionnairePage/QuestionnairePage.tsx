import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchQuestionnaireById } from '../../store/slices/questionnaireSlice';
import QuestionnaireForm from '../../components/QuestionnaireForm/QuestionnaireForm';
import styles from './QuestionnairePage.module.css';

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
    return <div className={styles.loading}>Завантаження...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!currentQuestionnaire) {
    return <div className={styles.notFound}>Опитування не знайдено</div>;
  }

  return (
    <div>
      <QuestionnaireForm questionnaire={currentQuestionnaire} />
    </div>
  );
};

export default QuestionnairePage;
