import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import QuestionnairePage from './Pages/QuestionnairePage/QuestionnairePage';
import CreateQuestionnairePage from './Pages/CreateQuestionnaire/CreateQuestionnairePage';
import EditQuestionnairePage from './Pages/EditQuestionnaire/EditQuestionnairePage';
import NotFound from './Pages/NotFound/NotFound';

const App: React.FC = () => {
  return (
      <>
        <div className="app">
          <nav>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/create'>Create</NavLink>
          </nav>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/create' element={<CreateQuestionnairePage />} />
            <Route path='/questionnaire/:id' element={<QuestionnairePage />} />
            <Route path='/builder/:id' element={<EditQuestionnairePage />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </>
  );
};

export default App;
