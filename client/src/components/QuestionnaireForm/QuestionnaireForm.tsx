import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { submitAnswers } from '../../store/slices/answersSlice';
import { Questionnaire } from '../../types';
import './QuestionnaireForm.css';

interface QuestionnaireFormProps {
  questionnaire: Questionnaire;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ questionnaire }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.answers);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const validateAnswers = () => {
    for (const question of questionnaire.questions) {
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

  return (
    <form onSubmit={handleSubmit} className="questionnaire-form">
      <h2>{questionnaire.title}</h2>
      {questionnaire.description && (
        <p className="description">{questionnaire.description}</p>
      )}

      {questionnaire.questions.map((question) => (
        <div key={question._id} className="question-container">
          <label className="question-label">
            {question.text}
            {question.required && <span className="required">*</span>}
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
            <div className="options-container">
              {question.options.map((option, index) => (
                <label key={index} className="option-label">
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
            <div className="options-container">
              {question.options.map((option, index) => (
                <label key={index} className="option-label">
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
        <div className="error-message">{error || localError}</div>
      )}

      <button 
        type="submit" 
        className="submit-button"
        disabled={loading}
      >
        {loading ? 'Відправка...' : 'Відправити відповіді'}
      </button>
    </form>
  );
};

export default QuestionnaireForm; 