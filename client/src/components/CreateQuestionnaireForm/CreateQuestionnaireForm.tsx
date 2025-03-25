import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { createQuestionnaire } from '../../store/slices/questionnaireSlice';
import { BaseQuestion, BaseQuestionnaire } from '../../types';
import './CreateQuestionnaireForm.css';

const CreateQuestionnaireForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.questionnaires);
  const [showSuccess, setShowSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<BaseQuestion[]>([]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'text',
        required: false,
        options: [],
      },
    ]);
  };

  const handleQuestionChange = (index: number, field: keyof BaseQuestion, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }
    updatedQuestions[questionIndex].options = [
      ...updatedQuestions[questionIndex].options,
      '',
    ];
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const now = new Date().toISOString();
      const questionnaireData: BaseQuestionnaire = {
        title,
        description,
        questions,
        createdAt: now,
        updatedAt: now
      };
      await dispatch(createQuestionnaire(questionnaireData)).unwrap();
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating questionnaire:', error);
    }
  };

  const handleCreateNew = () => {
    setTitle('');
    setDescription('');
    setQuestions([]);
    setShowSuccess(false);
  };

  if (showSuccess) {
    return (
      <div className="success-container">
        <div className="success-message">
          <h2>Опитування успішно створено!</h2>
          <div className="success-actions">
            <button onClick={handleCreateNew} className="action-button">
              Створити ще одне опитування
            </button>
            <button onClick={() => navigate('/')} className="action-button">
              Перейти на головну
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="create-questionnaire-form">
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
        <h3>Питання</h3>
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="question-item">
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
              >
                <option value="text">Текстова відповідь</option>
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

      <button
        type="submit"
        className="submit-button"
        disabled={loading}
      >
        {loading ? 'Створення...' : 'Створити опитування'}
      </button>
    </form>
  );
};

export default CreateQuestionnaireForm; 