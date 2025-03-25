import { Routes, Route } from 'react-router-dom';
import Navigate from './components/Navigate/Navigate';
import HomePage from './Pages/HomePage/HomePage';
import QuestionnairePage from './Pages/QuestionnairePage/QuestionnairePage';
import CreateQuestionnairePage from './Pages/CreateQuestionnaire/CreateQuestionnairePage';
import EditQuestionnairePage from './Pages/EditQuestionnaire/EditQuestionnairePage';
import NotFound from './Pages/NotFound/NotFound';
import './container.css';

const App: React.FC = () => {
  return (
      <>
        <Navigate />
        <div className="container">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/create' element={<CreateQuestionnairePage />} />
            <Route path='/questionnaire/:id' element={<QuestionnairePage />} />
            <Route path='/edit/:id' element={<EditQuestionnairePage />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </>
  );
};

export default App;
