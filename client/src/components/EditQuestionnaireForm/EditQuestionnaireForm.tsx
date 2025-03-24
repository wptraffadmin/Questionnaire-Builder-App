import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { updateQuestionnaire, fetchQuestionnaireById } from '../../store/slices/questionnaireSlice';
import { Question } from '../../types';
import './EditQuestionnaireForm.css';

const EditQuestionnaireForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentQuestionnaire, loading, error } = useSelector(
    (state: RootState) => state.questionnaires
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchQuestionnaireById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentQuestionnaire) {
      setTitle(currentQuestionnaire.title);
      setDescription(currentQuestionnaire.description || '');
      setQuestions(currentQuestionnaire.questions.map(q => ({
        ...q,
        options: [...(q.options || [])]
      })));
    }
  }, [currentQuestionnaire]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        _id: Date.now().toString(),
        text: '',
        type: 'text',
        required: false,
        options: [],
      },
    ]);
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === index) {
        return {
          ...q,
          [field]: value,
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === questionIndex) {
        return {
          ...q,
          options: [...(q.options || []), ''],
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === questionIndex) {
        const newOptions = [...(q.options || [])];
        newOptions[optionIndex] = value;
        return {
          ...q,
          options: newOptions,
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === questionIndex) {
        return {
          ...q,
          options: (q.options || []).filter((_, i) => i !== optionIndex),
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await dispatch(updateQuestionnaire({
        id,
        data: {
          title,
          description,
          questions,
        }
      })).unwrap();
      setShowSuccess(true);
    } catch (error) {
      console.error('Error updating questionnaire:', error);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!currentQuestionnaire) {
    return <div className="error">Опитування не знайдено</div>;
  }

  if (showSuccess) {
    return (
      <div className="success-container">
        <div className="success-message">
          <h2>Опитування успішно оновлено!</h2>
          <button onClick={handleBack} className="action-button">
            Повернутися на головну
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="edit-questionnaire-form">
      <div className="form-group">
        <label htmlFor="title">Назва опитування:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Опис:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="questions-section">
        <h3>Питання:</h3>
        {questions.map((question, qIndex) => (
          <div key={question._id} className="question-item">
            <div className="form-group">
              <label>Текст питання:</label>
              <input
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Тип питання:</label>
              <select
                value={question.type}
                onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                required
              >
                <option value="text">Текст</option>
                <option value="radio">Одиночний вибір</option>
                <option value="checkbox">Множинний вибір</option>
                <option value="select">Випадаючий список</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => handleQuestionChange(qIndex, 'required', e.target.checked)}
                />
                Обов'язкове питання
              </label>
            </div>

            {(question.type === 'radio' || question.type === 'checkbox' || question.type === 'select') && (
              <div className="options-section">
                <h4>Варіанти відповідей:</h4>
                {(question.options || []).map((option, oIndex) => (
                  <div key={oIndex} className="option-item">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      placeholder={`Варіант ${oIndex + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(qIndex, oIndex)}
                      className="remove-button"
                    >
                      Видалити
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddOption(qIndex)}
                  className="add-button"
                >
                  Додати варіант
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleRemoveQuestion(qIndex)}
              className="remove-button"
            >
              Видалити питання
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddQuestion}
          className="add-button"
        >
          Додати питання
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button
          type="button"
          onClick={handleBack}
          className="action-button"
        >
          Скасувати
        </button>
        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Оновлення...' : 'Оновити опитування'}
        </button>
      </div>
    </form>
  );
};

export default EditQuestionnaireForm; 