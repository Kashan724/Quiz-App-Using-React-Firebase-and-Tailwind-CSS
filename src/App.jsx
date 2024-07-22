import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import CreateQuiz from './components/CreateQuiz';
import QuizList from './components/QuizList';
import Navbar from './components/Navbar';
import UserQuizzes from './components/UserQuizzes';
import Layout from './components/layout/layout';

import TakeQuiz from './components/TakeQuiz';

const App = () => (
  <Router>
    <Layout>
    <div className="pt-20"> {/* Adjusted padding to match the navbar height */}
      <Routes>
        <Route path="/" element={<QuizList />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/take-quiz/:id" element={<TakeQuiz />} />
        <Route path="/user-quizzes" element={<UserQuizzes />} />
      </Routes>
    </div>
    </Layout>
  </Router>
);

export default App;
