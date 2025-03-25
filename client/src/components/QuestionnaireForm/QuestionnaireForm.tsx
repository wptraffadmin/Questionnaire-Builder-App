import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { submitAnswers } from '../../store/slices/answersSlice';
import { Questionnaire, Question } from '../../types';
import styles from './QuestionnaireForm.module.css';

interface QuestionnaireFormProps {
  questionnaire: Questionnaire;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ questionnaire }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.answers);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [localError, setLocalError] = useState<string | null>(null);
  const [processedQuestions, setProcessedQuestions] = useState<Question[]>([]);

  // Process questions to ensure they all have an _id property
  useEffect(() => {
    if (questionnaire && questionnaire.questions) {
      const questions = questionnaire.questions.map(q => {
        if ('_id' in q) {
          return q as Question;
        } else {
          return {
            ...q,
            _id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
          } as Question;
        }
      });
      setProcessedQuestions(questions);
    }
  }, [questionnaire]);

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const validateAnswers = () => {
    for (const question of processedQuestions) {
      if (question.required) {
        const answer = answers[question._id];
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          setLocalError(`Будь ласка, відповідь на питання: ${question.text}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!validateAnswers()) {
      return;
    }

    try {
      await dispatch(submitAnswers({
        questionnaireId: questionnaire._id,
        answers
      })).unwrap();
      navigate('/');
    } catch (error) {
      setLocalError('Помилка при відправці відповідей. Спробуйте ще раз.');
    }
  };

  if (processedQuestions.length === 0) {
    return <div className={styles.loading}>Завантаження питань...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.questionnaireForm}>
      <h2>{questionnaire.title}</h2>
      {questionnaire.description && (
        <p className={styles.description}>{questionnaire.description}</p>
      )}

      {processedQuestions.map((question) => (
        <div key={question._id} className={styles.questionContainer}>
          <label className={styles.questionLabel}>
            {question.text}
            {question.required && <span className={styles.required}>*</span>}
          </label>

          {question.type === 'text' && (
            <input
              type="text"
              value={answers[question._id] as string || ''}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              required={question.required}
            />
          )}

          {question.type === 'radio' && question.options && (
            <div className={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input
                    type="radio"
                    name={question._id}
                    value={option}
                    checked={answers[question._id] === option}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    required={question.required}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {question.type === 'checkbox' && question.options && (
            <div className={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input
                    type="checkbox"
                    value={option}
                    checked={(answers[question._id] as string[] || []).includes(option)}
                    onChange={(e) => {
                      const currentAnswers = (answers[question._id] as string[] || []);
                      const newAnswers = e.target.checked
                        ? [...currentAnswers, option]
                        : currentAnswers.filter(a => a !== option);
                      handleAnswerChange(question._id, newAnswers);
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {question.type === 'select' && question.options && (
            <select
              value={answers[question._id] as string || ''}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              required={question.required}
              className={styles.select}
            >
              <option value="">Оберіть відповідь</option>
              {question.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      {(error || localError) && (
        <div className={styles.errorMessage}>{error || localError}</div>
      )}

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? 'Submission...' : 'Submit'}
      </button>
    </form>
  );
};

export default QuestionnaireForm; 