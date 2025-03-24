import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { deleteQuestionnaire } from '../../store/slices/questionnaireSlice';
import { fetchQuestionnaireStats } from '../../store/slices/answersSlice';
import { Questionnaire } from '../../types';
import './QuestionnaireCard.css';

interface QuestionnaireCardProps {
  questionnaire: Questionnaire;
}

const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({ questionnaire }) => {
  const dispatch = useDispatch<AppDispatch>();
  const stats = useSelector((state: RootState) => 
    state.answers.questionnaireStats[questionnaire._id]
  );

  useEffect(() => {
    dispatch(fetchQuestionnaireStats(questionnaire._id));
  }, [dispatch, questionnaire._id]);

  const handleDelete = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити це опитування?')) {
      try {
        await dispatch(deleteQuestionnaire(questionnaire._id)).unwrap();
      } catch (error) {
        console.error('Error deleting questionnaire:', error);
      }
    }
  };

  return (
    <div className="questionnaire-card">
      <h3>{questionnaire.title}</h3>
      {questionnaire.description && <p>{questionnaire.description}</p>}
      
      <div className="questionnaire-stats">
        <div className="stat-item">
          <span className="stat-label">Проходжень:</span>
          <span className="stat-value">{stats?.totalResponses || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Запитань:</span>
          <span className="stat-value">{stats?.questionsCount || 0}</span>
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/builder/${questionnaire._id}`} className="action-button edit">
          Редагувати
        </Link>
        <Link to={`/questionnaire/${questionnaire._id}`} className="action-button view">
          Переглянути
        </Link>
        <button onClick={handleDelete} className="action-button delete">
          Видалити
        </button>
      </div>
    </div>
  );
};

export default QuestionnaireCard; 