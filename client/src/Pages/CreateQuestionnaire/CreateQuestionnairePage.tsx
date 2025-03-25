import CreateQuestionnaireForm from '../../components/CreateQuestionnaireForm/CreateQuestionnaireForm';
import styles from './CreateQuestionnaire.module.css';

const CreateQuestionnairePage: React.FC = () => {
  return (
    <div>
      <h1 className={styles.title}>Створення нового опитування</h1>
      <CreateQuestionnaireForm />
    </div>
  );
};

export default CreateQuestionnairePage; 