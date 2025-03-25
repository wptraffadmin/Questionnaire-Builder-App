import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { deleteQuestionnaire } from '../../store/slices/questionnaireSlice';
import { fetchQuestionnaireStats } from '../../store/slices/answersSlice';
import { Questionnaire } from '../../types';
import styles from './QuestionnaireCard.module.css';

interface QuestionnaireCardProps {
  questionnaire: Questionnaire;
}

const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({ questionnaire }) => {
  const dispatch = useDispatch<AppDispatch>();
  const stats = useSelector((state: RootState) => 
    state.answers.questionnaireStats[questionnaire._id]
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchQuestionnaireStats(questionnaire._id));
  }, [dispatch, questionnaire._id]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteQuestionnaire(questionnaire._id)).unwrap();
    } catch (error) {
      setError('Помилка при видаленні опитування');
      console.error('Error deleting questionnaire:', error);
    }
  };

  return (
    <div className={styles.questionnaireCard}>
      <div>
      <h2 className={styles.title}>{questionnaire.title}</h2>
      <p className={styles.description}>{questionnaire.description}</p>
      </div>
      <div>
      <div className={styles.questionnaireStats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Completion</span>
          <span className={styles.statValue}>{stats?.totalResponses || 0}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Questions</span>
          <span className={styles.statValue}>{stats?.questionsCount || questionnaire.questions.length}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Link to={`/questionnaire/${questionnaire._id}`} className={styles.actionButton}>
          Start 
        </Link>
        <Link to={`/edit/${questionnaire._id}`} className={styles.actionButton}>
          Edit
        </Link>
        <button 
          onClick={() => setShowConfirm(true)} 
          className={`${styles.actionButton} ${styles.deleteButton}`}
        >
          Delete
        </button>
      </div>
      </div>
      {showConfirm && (
        <div className={styles.confirmationModal}>
          <p>Are you sure you want to delete this survey?</p>
          <div className={styles.confirmationActions}>
            <button 
              onClick={handleDelete}
              className={`${styles.actionButton} ${styles.confirmDelete}`}
            >
              Yes, delete
            </button>
            <button 
              onClick={() => setShowConfirm(false)}
              className={styles.actionButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default QuestionnaireCard; 