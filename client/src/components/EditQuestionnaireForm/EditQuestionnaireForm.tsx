import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { updateQuestionnaire, fetchQuestionnaireById } from '../../store/slices/questionnaireSlice';
import { Question, BaseQuestion } from '../../types';
import styles from './EditQuestionnaireForm.module.css';

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
      setQuestions(currentQuestionnaire.questions.map(q => {
        // Ensure each question has an _id property
        if ('_id' in q) {
          return {
            ...q,
            options: [...(q.options || [])]
          } as Question;
        } else {
          return {
            ...q,
            _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            options: [...(q.options || [])]
          } as Question;
        }
      }));
    }
  }, [currentQuestionnaire]);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: '',
      type: 'text',
      required: false,
      options: [],
    };
    setQuestions([...questions, newQuestion]);
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
      // Convert Question[] to BaseQuestion[] by omitting _id property
      const baseQuestions: BaseQuestion[] = questions.map(({ _id, ...rest }) => rest);
      
      await dispatch(updateQuestionnaire({
        id,
        data: {
          title,
          description,
          questions: baseQuestions,
          updatedAt: new Date().toISOString()
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
    return <div className={styles.loading}>Завантаження...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!currentQuestionnaire) {
    return <div className={styles.error}>Опитування не знайдено</div>;
  }

  if (showSuccess) {
    return (
      <div className={styles.container}>
        <h2 className={styles.successTitle}>Опитування успішно оновлено!</h2>
        <button onClick={handleBack} className={styles.actionButton}>
          Повернутися на головну
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Редагування опитування</h2>
      <form onSubmit={handleSubmit} className={styles.editQuestionnaireForm}>
        <input
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Назва опитування"
          required
        />

        <textarea
          className={styles.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Опис опитування"
        />

        <div>
          {questions.map((question, qIndex) => (
            <div key={question._id}>
              <input
                type="text"
                className={styles.input}
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                placeholder="Текст питання"
              />

              <select
                className={styles.input}
                value={question.type}
                onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
              >
                <option value="text">Текст</option>
                <option value="radio">Один варіант</option>
                <option value="checkbox">Декілька варіантів</option>
              </select>

              <div>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={question.required}
                  onChange={(e) => handleQuestionChange(qIndex, 'required', e.target.checked)}
                />
                <label>Обов'язкове</label>
              </div>

              {(question.type === 'radio' || question.type === 'checkbox') && (
                <div>
                  {question.options?.map((option, oIndex) => (
                    <div key={oIndex}>
                      <input
                        type="text"
                        className={styles.input}
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder="Варіант відповіді"
                      />
                      <button
                        type="button"
                        className={styles.button}
                        onClick={() => handleRemoveOption(qIndex, oIndex)}
                      >
                        Видалити варіант
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => handleAddOption(qIndex)}
                  >
                    Додати варіант
                  </button>
                </div>
              )}

              <button
                type="button"
                className={styles.button}
                onClick={() => handleRemoveQuestion(qIndex)}
              >
                Видалити питання
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className={styles.actionButton}
          onClick={handleAddQuestion}
        >
          Додати питання
        </button>

        <button type="submit" className={styles.actionButton}>
          Зберегти зміни
        </button>
      </form>
    </div>
  );
};

export default EditQuestionnaireForm; 